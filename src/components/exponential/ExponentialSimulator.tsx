"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { NumberField } from "@/components/ui/NumberField";
import { Segmented } from "@/components/ui/Segmented";
import { GrowthChart } from "./GrowthChart";
import { GrowthInsights } from "./GrowthInsights";
import { buildGrowthSeries, exponentialAt, findTippingPoint, GROWTH_PRESETS, type GrowthInputs } from "@/lib/growth";
import { num, pct } from "@/lib/format";

/** Module 3 – The Exponential Content & Habit Simulator. */
export function ExponentialSimulator() {
  const [presetId, setPresetId] = useState(GROWTH_PRESETS[0].id);
  const preset = GROWTH_PRESETS.find((p) => p.id === presetId) ?? GROWTH_PRESETS[0];
  const [inputs, setInputs] = useState<GrowthInputs>(preset.inputs);
  const [quitPoint, setQuitPoint] = useState(Math.round(preset.inputs.periods * 0.4));
  const [logScale, setLogScale] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  const data = useMemo(() => buildGrowthSeries(inputs), [inputs]);
  const tippingPoint = useMemo(() => findTippingPoint(inputs), [inputs]);
  const tippingValue = tippingPoint !== null ? exponentialAt(inputs.start, inputs.rate, tippingPoint) : null;
  const safeQuit = Math.min(quitPoint, inputs.periods);

  const set = (patch: Partial<GrowthInputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  const loadPreset = (id: string) => {
    const p = GROWTH_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setInputs(p.inputs);
    setQuitPoint(Math.round(p.inputs.periods * 0.4));
  };

  return (
    <div className="space-y-6">
      <Card
        title="Thiết lập kịch bản"
        subtitle="So sánh tăng trưởng lũy kế y = a^x với kỳ vọng tuyến tính mà phần lớn mọi người ngầm đặt ra."
        actions={
          <Segmented
            ariaLabel="Kịch bản mẫu"
            value={presetId}
            onChange={loadPreset}
            options={GROWTH_PRESETS.map((p) => ({ value: p.id, label: p.name }))}
          />
        }
      >
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-5">
          <NumberField label="Giá trị ban đầu" value={inputs.start} onChange={(v) => set({ start: Math.max(0.0001, v) })} step={1} hint={preset.unit} />
          <Slider
            label={`Tăng trưởng lũy kế / ${preset.periodLabel}`}
            value={inputs.rate}
            min={0.001}
            max={0.3}
            step={0.001}
            format={(v) => pct(v, 1)}
            onChange={(v) => set({ rate: v })}
          />
          <NumberField
            label={`Kỳ vọng tuyến tính / ${preset.periodLabel}`}
            value={inputs.linearStep}
            onChange={(v) => set({ linearStep: v })}
            step={inputs.start < 10 ? 0.01 : 1}
            hint="Mức tăng cố định bạn mong đợi mỗi kỳ."
          />
          <Slider
            label={`Số ${preset.periodLabel}`}
            value={inputs.periods}
            min={10}
            max={preset.inputs.periods * 2}
            onChange={(v) => set({ periods: v })}
            format={num}
          />
          <Slider
            label={`Bạn thường bỏ cuộc ở ${preset.periodLabel}`}
            value={safeQuit}
            min={1}
            max={inputs.periods}
            onChange={setQuitPoint}
            format={num}
          />
        </div>
      </Card>

      <Card
        title="Đường cong điểm bùng phát"
        subtitle="Vùng tô đỏ là 'thung lũng thất vọng': nỗ lực vẫn tích lũy nhưng kết quả chưa lộ ra."
        actions={
          <>
            <Segmented
              ariaLabel="Thang đo trục Y"
              value={logScale ? "log" : "linear"}
              onChange={(v) => setLogScale(v === "log")}
              options={[
                { value: "linear", label: "Thang tuyến tính" },
                { value: "log", label: "Thang log" },
              ]}
            />
            <Segmented
              ariaLabel="Hiện kịch bản tệ đi"
              value={showDecline ? "on" : "off"}
              onChange={(v) => setShowDecline(v === "on")}
              options={[
                { value: "off", label: "Ẩn tệ đi" },
                { value: "on", label: `Tệ đi ${pct(inputs.rate, 1)}` },
              ]}
            />
          </>
        }
      >
        <GrowthChart
          data={data}
          tippingPoint={tippingPoint}
          tippingValue={tippingValue}
          quitPoint={safeQuit}
          periodLabel={preset.periodLabel}
          logScale={logScale}
          showDecline={showDecline}
        />
        <div className="mt-6">
          <GrowthInsights
            inputs={inputs}
            tippingPoint={tippingPoint}
            quitPoint={safeQuit}
            unit={preset.unit}
            periodLabel={preset.periodLabel}
          />
        </div>
      </Card>
    </div>
  );
}
