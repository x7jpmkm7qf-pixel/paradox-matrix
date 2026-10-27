"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { Stat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { axisProps, chartColors, tooltipStyle } from "@/components/ui/chartTheme";
import { computePosterior, naturalFrequencies, simulatePosterior, type BayesInputs } from "@/lib/bayes";
import { newSeed } from "@/lib/random";
import { num, pct } from "@/lib/format";

interface BayesUpdaterProps {
  inputs: BayesInputs;
  onChange: (inputs: BayesInputs) => void;
}

const TRIAL_OPTIONS = [
  { value: "1000", label: "1.000" },
  { value: "10000", label: "10.000" },
  { value: "100000", label: "100.000" },
];

export function BayesUpdater({ inputs, onChange }: BayesUpdaterProps) {
  const [trials, setTrials] = useState("10000");
  const [seed, setSeed] = useState(42);

  const result = useMemo(() => computePosterior(inputs), [inputs]);
  const freq = useMemo(() => naturalFrequencies(inputs), [inputs]);
  const series = useMemo(() => simulatePosterior(inputs, Number(trials), seed), [inputs, trials, seed]);
  const simulated = series[series.length - 1]?.estimate ?? 0;

  const set = (patch: Partial<BayesInputs>) => onChange({ ...inputs, ...patch });
  const shift = result.posterior - inputs.prior;
  const evidenceCount = freq.truePositives + freq.falsePositives;

  return (
    <Card
      title="Cập nhật niềm tin theo định lý Bayes"
      subtitle="Một tín hiệu tốt chưa chắc là dự án tốt. Hãy tính xác suất thật sau khi thấy bằng chứng."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-5">
          <Slider
            label="Tỷ lệ nền: dự án loại này thành công"
            value={inputs.prior}
            min={0.01}
            max={0.99}
            step={0.01}
            format={(v) => pct(v, 0)}
            onChange={(v) => set({ prior: v })}
            hint="Tỷ lệ thành công trung bình của những dự án tương tự trong ngành (base rate)."
          />
          <Slider
            label="Độ nhạy: dự án tốt cho tín hiệu tốt"
            value={inputs.sensitivity}
            min={0.01}
            max={0.99}
            step={0.01}
            format={(v) => pct(v, 0)}
            onChange={(v) => set({ sensitivity: v })}
            hint="VD: khi sản phẩm thực sự phù hợp thị trường, khảo sát khách hàng tích cực bao nhiêu % trường hợp?"
          />
          <Slider
            label="Báo động giả: dự án dở vẫn cho tín hiệu tốt"
            value={inputs.falsePositive}
            min={0.01}
            max={0.99}
            step={0.01}
            format={(v) => pct(v, 0)}
            onChange={(v) => set({ falsePositive: v })}
            hint="Bạn bè khen, khách nói 'sẽ mua'... Tín hiệu này xuất hiện ngay cả khi ý tưởng không ổn."
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink-700">Bạn vừa quan sát được</p>
            <Segmented
              ariaLabel="Bằng chứng quan sát được"
              value={inputs.signalObserved ? "yes" : "no"}
              onChange={(v) => set({ signalObserved: v === "yes" })}
              options={[
                { value: "yes", label: "Tín hiệu tích cực" },
                { value: "no", label: "Tín hiệu tiêu cực" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Trước bằng chứng" value={pct(inputs.prior)} caption="Xác suất tiên nghiệm" />
            <Stat
              label="Sau bằng chứng"
              value={pct(result.posterior)}
              caption={`${shift >= 0 ? "+" : ""}${(shift * 100).toFixed(1).replace(".", ",")} điểm %`}
              emphasis
            />
            <Stat
              label="Hệ số khả năng"
              value={Number.isFinite(result.likelihoodRatio) ? `×${result.likelihoodRatio.toFixed(2).replace(".", ",")}` : "∞"}
              caption="Bằng chứng mạnh cỡ nào"
            />
          </div>

          <div className="rounded-xl border border-ink-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Diễn giải bằng tần suất tự nhiên</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Trong <b>{num(freq.population)}</b> dự án giống của bạn, <b>{num(freq.successes)}</b> sẽ thành công. Có{" "}
              <b>{num(evidenceCount)}</b> dự án cho ra {inputs.signalObserved ? "tín hiệu tích cực" : "tín hiệu tiêu cực"} như bạn thấy,
              nhưng chỉ <b className="text-accent-700">{num(freq.truePositives)}</b> trong số đó thực sự thành công, còn{" "}
              <b className="text-red-600">{num(freq.falsePositives)}</b> là {inputs.signalObserved ? "báo động giả" : "dự án thất bại"}.
            </p>
            <FrequencyBar truePart={freq.truePositives} falsePart={freq.falsePositives} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink-700">
                Mô phỏng Monte Carlo: <span className="font-mono">{pct(simulated)}</span>
              </p>
              <div className="flex items-center gap-2">
                <Segmented ariaLabel="Số lần mô phỏng" value={trials} onChange={setTrials} options={TRIAL_OPTIONS} />
                <Button onClick={() => setSeed(newSeed())}>Chạy lại</Button>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                  <CartesianGrid stroke={chartColors.grid} vertical={false} />
                  <XAxis dataKey="trials" {...axisProps} tickFormatter={(v: number) => num(v)} />
                  <YAxis {...axisProps} domain={[0, 1]} tickFormatter={(v: number) => pct(v, 0)} />
                  <Tooltip
                    {...tooltipStyle}
                    labelFormatter={(v) => `${num(Number(v))} dự án mô phỏng`}
                    formatter={(v: number, name) => [pct(v), name === "exact" ? "Công thức Bayes" : "Mô phỏng"]}
                  />
                  <Line type="monotone" dataKey="exact" stroke={chartColors.muted} strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="estimate" stroke={chartColors.primary} dot={false} strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-xs text-ink-500">
              Đường liền là kết quả mô phỏng, hội tụ về đường đứt (công thức chính xác) khi số dự án tăng lên.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FrequencyBar({ truePart, falsePart }: { truePart: number; falsePart: number }) {
  const total = truePart + falsePart || 1;
  return (
    <div className="mt-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-ink-100">
        <div className="bg-accent-500 transition-all" style={{ width: `${(truePart / total) * 100}%` }} />
        <div className="bg-red-400 transition-all" style={{ width: `${(falsePart / total) * 100}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-500">
        <span>Thành công thật</span>
        <span>Báo động giả / thất bại</span>
      </div>
    </div>
  );
}
