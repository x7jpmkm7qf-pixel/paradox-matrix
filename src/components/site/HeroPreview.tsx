// Static product mock for the landing hero: what a verdict from the
// "có nên chi tiếp?" tool looks like, using the numbers from the cosmetics-shop case.
const POINTS: [string, number][] = [
  ["T1", 45],
  ["T2", 38],
  ["T3", 24],
  ["T4", 9],
];
const BREAK_EVEN = 20;

const x = (i: number) => 28 + i * 88;
const y = (pct: number) => 128 - pct * 2.3;

export function HeroPreview() {
  const line = POINTS.map(([, p], i) => `${i ? "L" : "M"}${x(i)},${y(p)}`).join(" ");
  const area = `${line} L${x(POINTS.length - 1)},128 L${x(0)},128 Z`;
  return (
    <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms]">
      <div className="absolute -inset-6 rounded-[2rem] bg-accent-600/25 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night-900/90 shadow-glow">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <p className="ml-2 truncate text-xs font-medium text-ink-300">Máy đo “có nên chi tiếp?”</p>
          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-ink-300">minh hoạ</span>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 pt-4 text-xs">
          <div className="rounded-lg bg-white/[0.05] px-3 py-2">
            <p className="text-ink-400">Đã chi quảng cáo</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-white">50.000.000đ</p>
          </div>
          <div className="rounded-lg bg-white/[0.05] px-3 py-2">
            <p className="text-ink-400">Lãi/lỗ 3 tháng</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-rose-400">Lỗ liên tục</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <p className="text-xs text-ink-400">Cơ hội có lãi nếu chạy tiếp</p>
          <svg viewBox="0 0 320 140" className="mt-1 w-full" role="img" aria-label="Cơ hội có lãi tụt từ 45% xuống 9% sau 4 tháng">
            <defs>
              <linearGradient id="pm-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b6cf6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3b6cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="20" x2="310" y1={y(BREAK_EVEN)} y2={y(BREAK_EVEN)} stroke="#ff8a1f" strokeDasharray="4 4" strokeOpacity="0.8" />
            <text x="22" y={y(BREAK_EVEN) + 14} fontSize="10" fill="#ffa54a">
              ngưỡng hoà vốn
            </text>
            <path d={area} fill="url(#pm-area)" />
            <path
              d={line}
              fill="none"
              stroke="#6090fa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="600"
              className="animate-draw"
            />
            {POINTS.map(([label, p], i) => {
              const last = i === POINTS.length - 1;
              return (
                <g key={label}>
                  <circle cx={x(i)} cy={y(p)} r={last ? 6 : 4} fill={last ? "#fb7185" : "#6090fa"} stroke="#0a1124" strokeWidth="2" />
                  <text x={x(i)} y={y(p) - 11} textAnchor="middle" fontSize="11" fontWeight="600" fill={last ? "#fda4af" : "#dbe6fe"}>
                    {p}%
                  </text>
                  <text x={x(i)} y="138" textAnchor="middle" fontSize="10" fill="#91919e">
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="m-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-300">Kết luận</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-white">Dừng. Mỗi đồng chi thêm đang lỗ.</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-300">Lý do duy nhất để chạy tiếp là tiếc 50 triệu đã chi.</p>
        </div>
      </div>

      <div className="absolute -right-2 -top-4 animate-float rounded-full border border-white/10 bg-night-800 px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:-right-6">
        ⏱ Kết luận sau 2 phút
      </div>
      <div className="absolute -bottom-6 -left-2 animate-float rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-night-950 shadow-lg [animation-delay:1.2s] sm:-left-6">
        Giữ lại ~120 triệu
      </div>
    </div>
  );
}
