import { money, num, pct } from "@/lib/format";
import { exponentialAt, linearAt, type GrowthInputs } from "@/lib/growth";
import type { NaturalFrequencies } from "@/lib/bayes";
import type { SimpsonReport } from "@/lib/simpson";

const C = {
  blue: "#6090fa",
  amber: "#fbbf24",
  red: "#f87171",
  green: "#34d399",
  dim: "rgba(255,255,255,0.12)",
  grid: "rgba(255,255,255,0.08)",
  text: "#d4d4d8",
  muted: "#a1a1aa",
};

function Frame({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-2xl border border-white/10 bg-night-950/60 p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</p>
      <div className="mt-3">{children}</div>
      <figcaption className="mt-3 text-xs leading-relaxed text-ink-400">{caption}</figcaption>
    </figure>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-300">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

/** 1,000 projects as dots: which ones showed the weak signal, and how many of those succeeded. */
export function FrequencyFigure({ f, evContinue, evStop }: { f: NaturalFrequencies; evContinue: number; evStop: number }) {
  const cols = 40;
  const size = 9;
  const dots = Array.from({ length: f.population }, (_, i) => {
    if (i < f.successes) return i < f.truePositives ? C.amber : C.blue;
    return i - f.successes < f.falsePositives ? C.red : C.dim;
  });
  const rows = Math.ceil(f.population / cols);
  const max = Math.max(Math.abs(evContinue), Math.abs(evStop));
  const bar = (v: number) => (Math.abs(v) / max) * 34;

  return (
    <div className="space-y-4">
      <Frame
        title={`${num(f.population)} dự án giống của bạn`}
        caption={`Ô sáng là dự án có 3 tháng yếu: ${num(f.truePositives + f.falsePositives)} dự án, chỉ ${num(f.truePositives)} thành công (vàng). Đó là lý do cơ hội tụt từ ${pct(f.successes / f.population, 0)} xuống ${pct(f.truePositives / (f.truePositives + f.falsePositives))}.`}
      >
        <svg viewBox={`0 0 ${cols * size} ${rows * size}`} className="w-full" role="img" aria-label="Lưới 1.000 dự án">
          {dots.map((color, i) => (
            <circle key={i} cx={(i % cols) * size + size / 2} cy={Math.floor(i / cols) * size + size / 2} r={size * 0.36} fill={color} />
          ))}
        </svg>
        <Legend
          items={[
            [C.amber, "Thành công, có 3 tháng yếu"],
            [C.blue, "Thành công, không yếu"],
            [C.red, "Thất bại, có 3 tháng yếu"],
            [C.dim, "Thất bại, không yếu"],
          ]}
        />
      </Frame>
      <Frame
        title="Tiền tương lai của hai con đường"
        caption="Khoản đã chi không nằm trong phép so, vì chọn đường nào cũng không lấy lại được."
      >
        <svg viewBox="0 0 100 34" className="w-full" role="img" aria-label="So sánh chạy tiếp và dừng">
          <line x1="50" y1="0" x2="50" y2="34" stroke={C.muted} strokeWidth="0.3" />
          {[
            { y: 4, label: "Chạy tiếp", v: evContinue, color: evContinue >= 0 ? C.blue : C.red },
            { y: 20, label: "Dừng, làm việc khác", v: evStop, color: C.green },
          ].map((r) => (
            <g key={r.label}>
              <rect x={r.v >= 0 ? 50 : 50 - bar(r.v)} y={r.y} width={bar(r.v)} height="9" rx="1.5" fill={r.color} />
              <text x={r.v >= 0 ? 49 : 51} y={r.y + 6.3} fontSize="3.6" fill={C.text} textAnchor={r.v >= 0 ? "end" : "start"}>
                {r.label}
              </text>
              <text
                x={r.v >= 0 ? 50 + bar(r.v) + 1 : 50 - bar(r.v) - 1}
                y={r.y + 6.3}
                fontSize="3.6"
                fontWeight="600"
                fill="#fff"
                textAnchor={r.v >= 0 ? "start" : "end"}
              >
                {money(r.v)}
              </text>
            </g>
          ))}
        </svg>
      </Frame>
    </div>
  );
}

/** Per-segment and total rates side by side, plus each team's customer mix. */
export function SimpsonFigure({ report, labelA, labelB }: { report: SimpsonReport; labelA: string; labelB: string }) {
  const groups = [
    ...report.segments.map((s) => ({ name: s.segment, a: s.aRate, b: s.bRate, total: false })),
    { name: "Con số tổng", a: report.total.aRate, b: report.total.bRate, total: true },
  ];
  const h = 60;
  const groupW = 100 / groups.length;

  return (
    <div className="space-y-4">
      <Frame
        title="Tỷ lệ chốt theo từng nhóm khách"
        caption={`${labelA} cao hơn ở từng nhóm, nhưng thấp hơn ở cột tổng. Cột tổng đảo chiều vì hai đội nhận cơ cấu khách khác nhau.`}
      >
        <svg viewBox={`0 0 100 ${h + 14}`} className="w-full" role="img" aria-label="Tỷ lệ chốt theo nhóm">
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1="0" x2="100" y1={h - t * h} y2={h - t * h} stroke={C.grid} strokeWidth="0.3" />
          ))}
          {groups.map((g, i) => {
            const x = i * groupW + groupW * 0.18;
            const w = groupW * 0.3;
            return (
              <g key={g.name}>
                {g.total && <rect x={i * groupW + 1} y="0" width={groupW - 2} height={h + 13} rx="2" fill="rgba(251,191,36,0.08)" />}
                {[
                  { v: g.a, c: C.blue, dx: 0 },
                  { v: g.b, c: C.muted, dx: w + 1 },
                ].map((bar, j) => (
                  <g key={j}>
                    <rect x={x + bar.dx} y={h - bar.v * h} width={w} height={bar.v * h} rx="1" fill={bar.c} />
                    <text x={x + bar.dx + w / 2} y={h - bar.v * h - 1.5} fontSize="3.2" fill="#fff" textAnchor="middle">
                      {pct(bar.v, 0)}
                    </text>
                  </g>
                ))}
                <text x={i * groupW + groupW / 2} y={h + 6} fontSize="3.4" fill={g.total ? C.amber : C.text} textAnchor="middle">
                  {g.name}
                </text>
              </g>
            );
          })}
        </svg>
        <Legend
          items={[
            [C.blue, labelA],
            [C.muted, labelB],
          ]}
        />
      </Frame>
      <Frame title="Mỗi đội được giao khách nào" caption="Khách dễ chốt dồn về một đội, nên con số tổng của đội đó được kéo lên.">
        <svg viewBox="0 0 100 30" className="w-full" role="img" aria-label="Cơ cấu khách của hai đội">
          {[
            { label: labelA, mix: report.segments.map((s) => s.aMix), y: 2 },
            { label: labelB, mix: report.segments.map((s) => s.bMix), y: 17 },
          ].map((row) => {
            let x = 18;
            return (
              <g key={row.label}>
                <text x="0" y={row.y + 6.5} fontSize="3.6" fill={C.text}>
                  {row.label}
                </text>
                {row.mix.map((m, i) => {
                  const w = m * 82;
                  const el = (
                    <g key={i}>
                      <rect x={x} y={row.y} width={w} height="10" fill={i === 0 ? C.green : "rgba(255,255,255,0.25)"} />
                      {w > 12 && (
                        <text x={x + w / 2} y={row.y + 6.5} fontSize="3.2" fill="#0e0e10" fontWeight="600" textAnchor="middle">
                          {pct(m, 0)}
                        </text>
                      )}
                    </g>
                  );
                  x += w;
                  return el;
                })}
              </g>
            );
          })}
        </svg>
        <Legend items={report.segments.map((s, i) => [i === 0 ? C.green : "rgba(255,255,255,0.25)", s.segment] as [string, string])} />
      </Frame>
    </div>
  );
}

/** Compounding reality against the straight line people expect, with the quit week and the tipping point marked. */
export function GrowthFigure({
  g,
  tipping,
  quitWeek,
  periodLabel,
  unit,
}: {
  g: GrowthInputs;
  tipping: number;
  quitWeek: number;
  periodLabel: string;
  unit: string;
}) {
  const W = 100;
  const H = 60;
  const maxY = exponentialAt(g.start, g.rate, g.periods);
  const x = (t: number) => (t / g.periods) * W;
  const y = (v: number) => H - (v / maxY) * H;
  const xs = Array.from({ length: g.periods + 1 }, (_, t) => t);
  const path = (f: (t: number) => number) => xs.map((t, i) => `${i ? "L" : "M"}${x(t).toFixed(2)},${y(f(t)).toFixed(2)}`).join(" ");
  const exp = (t: number) => exponentialAt(g.start, g.rate, t);
  const lin = (t: number) => linearAt(g.start, g.linearStep, t);
  const valley = xs.filter((t) => t <= tipping);
  const valleyPath = `${valley.map((t, i) => `${i ? "L" : "M"}${x(t)},${y(lin(t))}`).join(" ")} ${[...valley]
    .reverse()
    .map((t) => `L${x(t)},${y(exp(t))}`)
    .join(" ")} Z`;

  return (
    <Frame
      title={`${unit.charAt(0).toUpperCase() + unit.slice(1)} theo từng ${periodLabel}`}
      caption={`Vùng đỏ là "vùng thất vọng": thực tế thấp hơn mức mong đợi. Phần lớn người bỏ cuộc trong vùng này, ngay trước điểm bùng phát.`}
    >
      <svg viewBox={`-2 -4 ${W + 4} ${H + 12}`} className="w-full" role="img" aria-label="Đường tăng trưởng thật và mức mong đợi">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1="0" x2={W} y1={H - t * H} y2={H - t * H} stroke={C.grid} strokeWidth="0.3" />
        ))}
        <path d={valleyPath} fill="rgba(248,113,113,0.22)" />
        <path d={path(lin)} fill="none" stroke={C.muted} strokeWidth="0.6" strokeDasharray="1.5 1.2" />
        <path d={path(exp)} fill="none" stroke={C.blue} strokeWidth="0.9" />
        {[
          { t: quitWeek, label: `Định bỏ: ${periodLabel} ${quitWeek}`, color: C.red, dy: 0 },
          { t: tipping, label: `Bùng phát: ${periodLabel} ${num(Math.ceil(tipping))}`, color: C.amber, dy: 5 },
        ].map((m) => (
          <g key={m.label}>
            <line x1={x(m.t)} x2={x(m.t)} y1="0" y2={H} stroke={m.color} strokeWidth="0.4" strokeDasharray="1 1" />
            <circle cx={x(m.t)} cy={y(exp(m.t))} r="1.1" fill={m.color} />
            <text x={x(m.t) - 1} y={2 + m.dy} fontSize="3" fill={m.color} textAnchor="end">
              {m.label}
            </text>
          </g>
        ))}
        <text x="0" y={H + 5} fontSize="3" fill={C.muted}>
          {periodLabel} 0
        </text>
        <text x={W} y={H + 5} fontSize="3" fill={C.muted} textAnchor="end">
          {periodLabel} {g.periods}
        </text>
      </svg>
      <Legend
        items={[
          [C.blue, "Thực tế (tăng kép)"],
          [C.muted, "Mức bạn mong (tăng đều)"],
        ]}
      />
    </Frame>
  );
}
