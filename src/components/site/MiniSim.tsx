"use client";

import { useState } from "react";
import { findTippingPoint } from "@/lib/growth";

// Quick try-it widgets for the landing page. They run on made-up numbers only,
// so they never touch the free-verdict quota or ask for an account.

type Tone = "go" | "wait" | "stop";

const TONE: Record<Tone, string> = {
  go: "border-emerald-200 bg-emerald-50 text-emerald-900",
  wait: "border-amber-200 bg-amber-50 text-amber-900",
  stop: "border-rose-200 bg-rose-50 text-rose-900",
};

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2 text-xs text-ink-600">
        {label}
        <span className="font-mono text-sm font-semibold text-ink-900">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        className="pm-range mt-2 w-full touch-pan-y py-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Verdict({ tone, title, body }: { tone: Tone; title: string; body: string }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${TONE[tone]}`} aria-live="polite">
      <p className="text-sm font-semibold leading-snug">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed opacity-80">{body}</p>
    </div>
  );
}

/** Each losing week is evidence: it shows up 50% of the time if the campaign will pay off, 80% if it won't. */
function SunkCostSim() {
  const [start, setStart] = useState(40);
  const [lossWeeks, setLossWeeks] = useState(3);
  const odds = (start / (100 - start)) * Math.pow(0.5 / 0.8, lossWeeks);
  const now = Math.round((odds / (1 + odds)) * 100);
  const tone: Tone = now >= 30 ? "go" : now >= 15 ? "wait" : "stop";
  return (
    <div className="space-y-3">
      <Range label="Lúc đầu bạn tin cơ hội có lãi" value={start} min={10} max={80} unit="%" onChange={setStart} />
      <Range label="Số tuần liên tiếp bị lỗ" value={lossWeeks} min={0} max={8} unit=" tuần" onChange={setLossWeeks} />
      <div>
        <div className="flex items-baseline justify-between text-xs text-ink-600">
          Cơ hội có lãi thật sự lúc này
          <span className="text-lg font-bold text-ink-900">{now}%</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className={`h-full rounded-full transition-all duration-300 ${tone === "go" ? "bg-emerald-500" : tone === "wait" ? "bg-amber-500" : "bg-rose-500"}`}
            style={{ width: `${now}%` }}
          />
        </div>
      </div>
      {tone === "stop" ? (
        <Verdict
          tone="stop"
          title={lossWeeks ? "Dừng. Mỗi đồng chi thêm đang lỗ." : "Cơ hội quá thấp."}
          body={
            lossWeeks
              ? `Từ ${start}% tụt còn ${now}%. Lý do duy nhất để chạy tiếp là tiếc tiền đã chi.`
              : `Chỉ ${now}% cơ hội có lãi ngay từ đầu. Chỉ làm nếu chịu được mất trắng khoản này.`
          } />
      ) : tone === "wait" ? (
        <Verdict tone="wait" title="Thận trọng: đặt mốc dừng ngay." body={`Còn ${now}%. Quy định trước: thêm 1–2 tuần lỗ nữa là tắt, không bàn lại.`} />
      ) : (
        <Verdict tone="go" title="Chạy tiếp được." body={`Còn ${now}% cơ hội có lãi. Theo dõi số liệu từng tuần để kịp dừng nếu đổi chiều.`} />
      )}
    </div>
  );
}

/** Two branches, two customer groups. B beats A in both groups; only the mix of hard customers differs. */
const RATES = { easy: { a: 85, b: 90 }, hard: { a: 50, b: 55 } };

function ReportSim() {
  const [hardA, setHardA] = useState(20);
  const [hardB, setHardB] = useState(60);
  const total = (who: "a" | "b", hard: number) => Math.round((RATES.easy[who] * (100 - hard) + RATES.hard[who] * hard) / 100);
  const a = total("a", hardA);
  const b = total("b", hardB);
  const misleading = a > b;
  const bars: [string, number, number][] = [
    ["Báo cáo tổng", a, b],
    ["Khách dễ", RATES.easy.a, RATES.easy.b],
    ["Khách khó", RATES.hard.a, RATES.hard.b],
  ];
  return (
    <div className="space-y-3">
      <Range label="Phần khách khó giao cho chi nhánh A" value={hardA} min={0} max={90} step={5} unit="%" onChange={setHardA} />
      <Range label="Phần khách khó giao cho chi nhánh B" value={hardB} min={0} max={90} step={5} unit="%" onChange={setHardB} />
      <div className="space-y-1.5">
        <p className="flex gap-3 text-[11px] text-ink-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-accent-500" /> Chi nhánh A
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-flame-500" /> Chi nhánh B
          </span>
          <span className="ml-auto">Tỷ lệ chốt đơn</span>
        </p>
        {bars.map(([label, va, vb], i) => (
          <div key={label} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 text-[11px]">
            <span className={i ? "text-ink-500" : "font-semibold text-ink-800"}>{label}</span>
            <div className="space-y-0.5">
              {[
                [va, "bg-accent-500"],
                [vb, "bg-flame-500"],
              ].map(([v, c]) => (
                <div key={c} className="flex items-center gap-1.5">
                  <div className={`h-2 rounded-full transition-all duration-300 ${c}`} style={{ width: `${v}%` }} />
                  <span className="font-mono text-ink-600">{v}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {misleading ? (
        <Verdict
          tone="stop"
          title="Báo cáo tổng đang nói ngược."
          body={`Tổng: A ${a}% hơn B ${b}%. Nhưng B thắng ở cả 2 nhóm khách. A chỉ được giao nhiều khách dễ.`}
        />
      ) : (
        <Verdict tone="go" title="Tổng và từng nhóm khớp nhau." body={`B ${b}% ≥ A ${a}%, và B cũng thắng ở từng nhóm. Báo cáo tổng tin được.`} />
      )}
    </div>
  );
}

/** Compounding growth vs. the steady +13.5%-of-start each week people expect. Calibrated so 8%/week tips around week 14. */
const EXPECTED_STEP = 13.5;
const HORIZON = 52;

function GrowthSim() {
  const [rate, setRate] = useState(8);
  const [weeks, setWeeks] = useState(9);
  const tip = findTippingPoint({ start: 100, rate: rate / 100, linearStep: EXPECTED_STEP, periods: HORIZON });
  const tipWeek = tip === null ? null : Math.ceil(tip);

  const W = 260;
  const H = 70;
  const maxY = Math.max(100 * Math.pow(1 + rate / 100, 24), 100 + EXPECTED_STEP * 24);
  const pt = (x: number, y: number) => `${((x / 24) * W).toFixed(1)},${(H - (y / maxY) * (H - 4)).toFixed(1)}`;
  const curve = Array.from({ length: 25 }, (_, x) => pt(x, 100 * Math.pow(1 + rate / 100, x))).join(" ");
  const expected = `${pt(0, 100)} ${pt(24, 100 + EXPECTED_STEP * 24)}`;
  const nowX = (Math.min(weeks, 24) / 24) * W;

  return (
    <div className="space-y-3">
      <Range label="Tốc độ tăng mỗi tuần" value={rate} min={2} max={15} unit="%" onChange={setRate} />
      <Range label="Bạn đã làm được" value={weeks} min={1} max={24} unit=" tuần" onChange={setWeeks} />
      <svg viewBox={`0 0 ${W} ${H + 12}`} className="w-full" role="img" aria-label="Đường tăng thật so với kỳ vọng tăng đều">
        <polyline points={expected} fill="none" stroke="#b8b8c1" strokeDasharray="4 3" strokeWidth="1.5" />
        <polyline points={curve} fill="none" stroke="#3b6cf6" strokeWidth="2.5" strokeLinejoin="round" />
        {tipWeek !== null && tipWeek <= 24 && (
          <circle cx={(tipWeek / 24) * W} cy={H - ((100 + EXPECTED_STEP * tipWeek) / maxY) * (H - 4)} r="4.5" fill="#ff8a1f" />
        )}
        <line x1={nowX} x2={nowX} y1="0" y2={H} stroke="#f43f5e" strokeWidth="1.5" />
        <text x={Math.min(nowX + 3, W - 40)} y="9" fontSize="8" fill="#e11d48">
          bạn ở đây
        </text>
        <text x="0" y={H + 10} fontSize="8" fill="#91919e">
          Tuần 0
        </text>
        <text x={W} y={H + 10} fontSize="8" fill="#91919e" textAnchor="end">
          Tuần 24
        </text>
      </svg>
      <p className="flex gap-3 text-[11px] text-ink-500">
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-3 bg-accent-500" /> Thực tế
        </span>
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-3 border-t border-dashed border-ink-400" /> Bạn kỳ vọng
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-flame-500" /> Điểm bật
        </span>
      </p>
      {tipWeek === null ? (
        <Verdict tone="stop" title="Tốc độ này chưa đủ để bật lên trong 1 năm." body="Đừng chỉ trụ. Đổi cách làm để tăng tốc độ mỗi tuần trước đã." />
      ) : weeks >= tipWeek ? (
        <Verdict tone="go" title={`Đã qua điểm bật (tuần ${tipWeek}).`} body="Từ đây mỗi tuần tăng nhanh hơn kỳ vọng. Giữ nhịp, đừng đổi hướng." />
      ) : tipWeek - weeks <= 10 ? (
        <Verdict tone="go" title={`Trụ thêm ${tipWeek - weeks} tuần.`} body={`Điểm bật rơi vào khoảng tuần ${tipWeek}. Bỏ bây giờ là bỏ ngay trước khi kết quả tới.`} />
      ) : (
        <Verdict tone="wait" title={`Còn khoảng ${tipWeek - weeks} tuần mới bật.`} body={`Điểm bật ở tuần ${tipWeek}. Trụ được thì trụ, hoặc tìm cách tăng tốc độ mỗi tuần.`} />
      )}
    </div>
  );
}

export function MiniSim({ kind }: { kind: "bayes" | "simpson" | "exponential" }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-4">
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent-700">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
        Thử nhanh · kéo thanh trượt
      </p>
      {kind === "bayes" ? <SunkCostSim /> : kind === "simpson" ? <ReportSim /> : <GrowthSim />}
      <p className="mt-2 text-[10px] text-ink-400">Số giả lập, không cần đăng ký. Không tính vào lượt miễn phí.</p>
    </div>
  );
}
