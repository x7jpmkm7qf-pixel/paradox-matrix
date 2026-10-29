export interface GrowthInputs {
  /** Starting value (followers, revenue, skill score...). */
  start: number;
  /** Compounding rate per period, e.g. 0.01 = 1%. */
  rate: number;
  /** Linear gain expected per period. */
  linearStep: number;
  periods: number;
}

export interface GrowthPoint {
  x: number;
  exponential: number;
  linear: number;
  decline: number;
  /** Gap where reality (exponential) is still below linear expectation. */
  valley: [number, number] | null;
}

/** y = start · a^x, with a = 1 + rate. */
export const exponentialAt = (start: number, rate: number, x: number) => start * Math.pow(1 + rate, x);

export const linearAt = (start: number, step: number, x: number) => start + step * x;

export function buildGrowthSeries(g: GrowthInputs): GrowthPoint[] {
  const points: GrowthPoint[] = [];
  const stride = Math.max(1, Math.ceil(g.periods / 200));
  for (let x = 0; x <= g.periods; x += stride) points.push(pointAt(g, x));
  if (points[points.length - 1]?.x !== g.periods) points.push(pointAt(g, g.periods));
  return points;
}

function pointAt(g: GrowthInputs, x: number): GrowthPoint {
  const exponential = exponentialAt(g.start, g.rate, x);
  const linear = linearAt(g.start, g.linearStep, x);
  const decline = g.start * Math.pow(Math.max(0, 1 - g.rate), x);
  return { x, exponential, linear, decline, valley: exponential < linear ? [exponential, linear] : null };
}

/**
 * Tipping point = the first period (after x=0) where the compounding curve
 * overtakes the linear expectation. Found by bisection on f(x) = exp - lin.
 */
export function findTippingPoint(g: GrowthInputs): number | null {
  const f = (x: number) => exponentialAt(g.start, g.rate, x) - linearAt(g.start, g.linearStep, x);
  // Need a region where f < 0 first (the "valley of disappointment").
  const scan = Math.max(1, g.periods / 2000);
  let lo: number | null = null;
  for (let x = scan; x <= g.periods; x += scan) {
    if (lo === null && f(x) < 0) lo = x;
    if (lo !== null && f(x) >= 0) {
      let a = lo;
      let b = x;
      for (let i = 0; i < 60; i++) {
        const m = (a + b) / 2;
        if (f(m) < 0) a = m;
        else b = m;
      }
      return b;
    }
  }
  return null;
}

/** Period at which the exponential curve reaches `share` of its final value. */
export function periodToReachShare(g: GrowthInputs, share: number): number {
  const final = exponentialAt(g.start, g.rate, g.periods);
  const target = g.start + (final - g.start) * share;
  if (g.rate <= 0) return g.periods;
  return Math.log(target / g.start) / Math.log(1 + g.rate);
}

/** Share of the total gain achieved by a given period. */
export function shareOfGainAt(g: GrowthInputs, x: number): number {
  const final = exponentialAt(g.start, g.rate, g.periods);
  if (final === g.start) return 0;
  return (exponentialAt(g.start, g.rate, x) - g.start) / (final - g.start);
}

/** Plain-words copy for one preset, so every input reads as a question the visitor can answer. */
export interface GrowthCopy {
  /** One line on what this example is, shown under the inputs and as the button tooltip. */
  about: string;
  startLabel: string;
  startHint: string;
  rateLabel: string;
  rateHint: string;
  stepLabel: string;
  stepHint: string;
  quitLabel: string;
  quitHint: string;
}

export interface GrowthPreset {
  id: string;
  name: string;
  unit: string;
  /** Short unit shown inside the input box, e.g. "triệu". */
  unitShort: string;
  periodLabel: string;
  /** How many periods make one year, to translate the horizon ("52 tuần ≈ 1 năm"). */
  perYear: number;
  inputs: GrowthInputs;
  copy: GrowthCopy;
}

export const GROWTH_PRESETS: GrowthPreset[] = [
  {
    id: "content",
    name: "Xây kênh, kéo người theo dõi",
    unit: "người theo dõi",
    unitShort: "người",
    periodLabel: "tuần",
    perYear: 52,
    inputs: { start: 100, rate: 0.08, linearStep: 30, periods: 52 },
    copy: {
      about: "Kênh TikTok, Facebook, YouTube… Tính theo tuần.",
      startLabel: "Kênh đang có bao nhiêu người theo dõi?",
      startHint: "Con số hôm nay, chưa cần đẹp. VD: 100.",
      rateLabel: "Mỗi tuần người theo dõi tăng bao nhiêu %?",
      rateHint: "8% = tuần này 100 người, tuần sau 108. Kênh mới đăng đều thường 3–10%.",
      stepLabel: "Bạn nghĩ mỗi tuần thêm được bao nhiêu người?",
      stepHint: "Mức tăng đều đều bạn đang kỳ vọng. Ghi số người, không phải %. VD: 30.",
      quitLabel: "Tuần thứ mấy bạn hay nản, muốn ngừng đăng?",
      quitHint: "Thành thật nhé. Chưa biết thì cứ để nguyên.",
    },
  },
  {
    id: "habit",
    name: "Luyện một kỹ năng mỗi ngày",
    unit: "điểm kỹ năng",
    unitShort: "điểm",
    periodLabel: "ngày",
    perYear: 365,
    inputs: { start: 1, rate: 0.01, linearStep: 0.02, periods: 365 },
    copy: {
      about: "Ngoại ngữ, bán hàng, tập gym… Mỗi ngày khá hơn hôm qua một chút. Tính theo ngày.",
      startLabel: "Trình độ hôm nay (tính là 1 điểm)",
      startHint: "Coi trình độ hôm nay là 1 điểm. Lên 2 điểm = giỏi gấp đôi. Nên để nguyên 1.",
      rateLabel: "Mỗi ngày giỏi lên bao nhiêu %?",
      rateHint: "1% = hôm nay nhỉnh hơn hôm qua một chút: thêm 10 trang sách, 15 phút luyện.",
      stepLabel: "Bạn nghĩ mỗi ngày khá lên bao nhiêu điểm?",
      stepHint: "Ghi số điểm, không phải %. VD: 0,02 điểm/ngày = sau 50 ngày giỏi gấp đôi nếu tiến bộ đều đều.",
      quitLabel: "Ngày thứ mấy bạn hay bỏ tập?",
      quitHint: "Lần trước luyện thứ gì đó, bạn bỏ ở đâu? Chưa biết thì cứ để nguyên.",
    },
  },
  {
    id: "mrr",
    name: "Doanh thu hàng tháng",
    unit: "triệu đồng",
    unitShort: "triệu",
    periodLabel: "tháng",
    perYear: 12,
    inputs: { start: 20, rate: 0.12, linearStep: 8, periods: 36 },
    copy: {
      about: "Tiền khách trả đều mỗi tháng: gói thành viên, thuê bao, hợp đồng duy trì. Tính theo tháng.",
      startLabel: "Doanh thu tháng này (triệu đồng)",
      startHint: "VD: 20 = 20 triệu/tháng.",
      rateLabel: "Mỗi tháng doanh thu tăng bao nhiêu %?",
      rateHint: "Lấy tháng này chia tháng trước. VD 22 triệu / 20 triệu = tăng 10%.",
      stepLabel: "Bạn nghĩ mỗi tháng thêm được bao nhiêu triệu?",
      stepHint: "Mức tăng đều đều bạn đang kỳ vọng. Ghi số triệu, không phải %. VD: 8.",
      quitLabel: "Tháng thứ mấy bạn định dừng hoặc đổi hướng?",
      quitHint: "Thành thật nhé. Chưa biết thì cứ để nguyên.",
    },
  },
];
