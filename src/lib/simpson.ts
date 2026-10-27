export interface SegmentRow {
  segment: string;
  aSuccess: number;
  aTotal: number;
  bSuccess: number;
  bTotal: number;
}

export interface SegmentAnalysis extends SegmentRow {
  aRate: number;
  bRate: number;
  /** Share of all A observations that sit in this segment. */
  aMix: number;
  bMix: number;
  winner: Winner;
}

export type Winner = "A" | "B" | "tie";

export interface SimpsonReport {
  segments: SegmentAnalysis[];
  total: { aSuccess: number; aTotal: number; bSuccess: number; bTotal: number; aRate: number; bRate: number; winner: Winner };
  segmentWins: { A: number; B: number; tie: number };
  /** Rate A would have if it had B's segment mix (direct standardisation). */
  aRateAdjusted: number;
  bRateAdjusted: number;
  adjustedWinner: Winner;
  severity: "paradox" | "partial" | "consistent" | "insufficient";
  /** Segment where the mix of A and B differs the most – the likely confounder. */
  mostSkewedSegment: SegmentAnalysis | null;
}

const rate = (s: number, t: number) => (t > 0 ? s / t : 0);

const compare = (a: number, b: number, eps = 1e-9): Winner => (Math.abs(a - b) < eps ? "tie" : a > b ? "A" : "B");

export function analyseSimpson(rows: SegmentRow[]): SimpsonReport {
  const valid = rows.filter((r) => r.aTotal > 0 && r.bTotal > 0);
  const aTotal = valid.reduce((s, r) => s + r.aTotal, 0);
  const bTotal = valid.reduce((s, r) => s + r.bTotal, 0);
  const aSuccess = valid.reduce((s, r) => s + r.aSuccess, 0);
  const bSuccess = valid.reduce((s, r) => s + r.bSuccess, 0);

  const segments: SegmentAnalysis[] = valid.map((r) => {
    const aRate = rate(r.aSuccess, r.aTotal);
    const bRate = rate(r.bSuccess, r.bTotal);
    return {
      ...r,
      aRate,
      bRate,
      aMix: rate(r.aTotal, aTotal),
      bMix: rate(r.bTotal, bTotal),
      winner: compare(aRate, bRate),
    };
  });

  const total = {
    aSuccess,
    aTotal,
    bSuccess,
    bTotal,
    aRate: rate(aSuccess, aTotal),
    bRate: rate(bSuccess, bTotal),
    winner: compare(rate(aSuccess, aTotal), rate(bSuccess, bTotal)),
  };

  const segmentWins = { A: 0, B: 0, tie: 0 };
  segments.forEach((s) => segmentWins[s.winner]++);

  // Standardise both groups to the combined population mix so the comparison is like-for-like.
  const pooled = aTotal + bTotal;
  const aRateAdjusted = segments.reduce((s, r) => s + r.aRate * ((r.aTotal + r.bTotal) / pooled), 0);
  const bRateAdjusted = segments.reduce((s, r) => s + r.bRate * ((r.aTotal + r.bTotal) / pooled), 0);
  const adjustedWinner = compare(aRateAdjusted, bRateAdjusted);

  let severity: SimpsonReport["severity"] = "consistent";
  if (segments.length < 2) severity = "insufficient";
  else if (total.winner !== "tie") {
    const opposite = total.winner === "A" ? "B" : "A";
    if (segmentWins[opposite] === segments.length) severity = "paradox";
    else if (segmentWins[opposite] > segmentWins[total.winner] || adjustedWinner === opposite) severity = "partial";
  }

  const mostSkewedSegment =
    segments.length > 0
      ? segments.reduce((best, s) => (Math.abs(s.aMix - s.bMix) > Math.abs(best.aMix - best.bMix) ? s : best))
      : null;

  return { segments, total, segmentWins, aRateAdjusted, bRateAdjusted, adjustedWinner, severity, mostSkewedSegment };
}

export interface CsvParseResult {
  rows: SegmentRow[];
  errors: string[];
}

/**
 * Accepts CSV/TSV with 5 columns: segment, A_success, A_total, B_success, B_total.
 * A header row is detected and skipped automatically.
 */
export function parseSegmentCsv(text: string): CsvParseResult {
  const rows: SegmentRow[] = [];
  const errors: string[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  lines.forEach((line, idx) => {
    const delimiter = line.includes("\t") ? "\t" : line.includes(";") ? ";" : ",";
    const cells = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cells.length < 5) {
      errors.push(`Dòng ${idx + 1}: cần 5 cột, nhận được ${cells.length}.`);
      return;
    }
    const numbers = cells.slice(1, 5).map((c) => Number(c.replace(/[\s.]/g, "").replace(",", ".")));
    if (numbers.some((n) => Number.isNaN(n))) {
      if (idx === 0) return; // header row
      errors.push(`Dòng ${idx + 1}: có giá trị không phải số.`);
      return;
    }
    const [aSuccess, aTotal, bSuccess, bTotal] = numbers;
    if (aSuccess > aTotal || bSuccess > bTotal) {
      errors.push(`Dòng ${idx + 1}: số thành công lớn hơn tổng.`);
      return;
    }
    rows.push({ segment: cells[0] || `Nhóm ${rows.length + 1}`, aSuccess, aTotal, bSuccess, bTotal });
  });

  return { rows, errors };
}

export function toCsv(rows: SegmentRow[]): string {
  const header = "segment,A_success,A_total,B_success,B_total";
  return [header, ...rows.map((r) => [r.segment, r.aSuccess, r.aTotal, r.bSuccess, r.bTotal].join(","))].join("\n");
}

export interface SimpsonPreset {
  id: string;
  name: string;
  labelA: string;
  labelB: string;
  metric: string;
  rows: SegmentRow[];
}

export const SIMPSON_PRESETS: SimpsonPreset[] = [
  {
    id: "sales-team",
    name: "Hai đội sales",
    labelA: "Đội A",
    labelB: "Đội B",
    metric: "Tỷ lệ chốt đơn",
    rows: [
      { segment: "Khách SME", aSuccess: 81, aTotal: 87, bSuccess: 234, bTotal: 270 },
      { segment: "Khách doanh nghiệp lớn", aSuccess: 192, aTotal: 263, bSuccess: 55, bTotal: 80 },
    ],
  },
  {
    id: "ads-channel",
    name: "Kênh quảng cáo",
    labelA: "Facebook Ads",
    labelB: "Google Ads",
    metric: "Tỷ lệ chuyển đổi",
    rows: [
      { segment: "Thiết bị di động", aSuccess: 240, aTotal: 8000, bSuccess: 25, bTotal: 1000 },
      { segment: "Máy tính", aSuccess: 60, aTotal: 1000, bSuccess: 448, bTotal: 8000 },
      { segment: "Tablet", aSuccess: 40, aTotal: 1000, bSuccess: 30, bTotal: 1000 },
    ],
  },
  {
    id: "pricing",
    name: "Gói giá mới vs cũ",
    labelA: "Giá mới",
    labelB: "Giá cũ",
    metric: "Tỷ lệ giữ chân",
    rows: [
      { segment: "Khách mới", aSuccess: 420, aTotal: 600, bSuccess: 110, bTotal: 200 },
      { segment: "Khách quay lại", aSuccess: 380, aTotal: 400, bSuccess: 720, bTotal: 800 },
    ],
  },
];
