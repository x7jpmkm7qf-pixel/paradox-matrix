"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { NumberField } from "@/components/ui/NumberField";
import { Segmented } from "@/components/ui/Segmented";
import { GrowthChart } from "./GrowthChart";
import { GrowthInsights } from "./GrowthInsights";
import { VerdictGate } from "@/components/pro/VerdictGate";
import { buildGrowthSeries, exponentialAt, findTippingPoint, GROWTH_PRESETS, type GrowthInputs } from "@/lib/growth";
import { num, pct } from "@/lib/format";

/** "0,5 năm" style horizon, so the visitor can picture the time span. */
function yearsLabel(years: number) {
  return years < 1 ? `${num(Math.round(years * 12))} tháng` : `${num(Math.round(years * 10) / 10)} năm`;
}

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

  const copy = preset.copy;
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
        title="Nhập số của bạn"
        subtitle="Làm đúng thì kết quả đến muộn rồi đến dồn. Chọn ví dụ gần với bạn nhất, sửa số cho đúng thực tế. Không biết số nào thì cứ để nguyên."
        actions={
          <Segmented
            ariaLabel="Kịch bản mẫu"
            value={presetId}
            onChange={loadPreset}
            options={GROWTH_PRESETS.map((p) => ({ value: p.id, label: p.name, title: p.copy.about }))}
          />
        }
      >
        <p className="mb-5 text-sm text-ink-600">
          <span className="font-medium text-ink-800">{preset.name}:</span> {preset.copy.about}
        </p>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-5">
          <NumberField
            label={copy.startLabel}
            value={inputs.start}
            onChange={(v) => set({ start: Math.max(0.0001, v) })}
            step={1}
            suffix={preset.unitShort}
            hint={copy.startHint}
          />
          <Slider
            label={copy.rateLabel}
            value={inputs.rate}
            min={0.001}
            max={0.3}
            step={0.001}
            format={(v) => pct(v, 1)}
            onChange={(v) => set({ rate: v })}
            hint={copy.rateHint}
          />
          <NumberField
            label={copy.stepLabel}
            value={inputs.linearStep}
            onChange={(v) => set({ linearStep: v })}
            step={inputs.start < 10 ? 0.01 : 1}
            suffix={`${preset.unitShort}/${preset.periodLabel}`}
            hint={copy.stepHint}
          />
          <Slider
            label={`Bạn muốn nhìn xa bao nhiêu ${preset.periodLabel}?`}
            value={inputs.periods}
            min={10}
            max={preset.inputs.periods * 2}
            onChange={(v) => set({ periods: v })}
            format={num}
            hint={`Khoảng thời gian bạn sẵn sàng kiên trì. ${num(inputs.periods)} ${preset.periodLabel} ≈ ${yearsLabel(inputs.periods / preset.perYear)}.`}
          />
          <Slider
            label={copy.quitLabel}
            value={safeQuit}
            min={1}
            max={inputs.periods}
            onChange={setQuitPoint}
            format={num}
            hint={copy.quitHint}
          />
        </div>
      </Card>

      <Card
        title="Bao giờ công sức bắt đầu được trả công?"
        subtitle="Đường xanh là kết quả thật, đường xám là mức bạn tưởng tượng. Chỗ hai đường cắt nhau là lúc bạn bắt đầu lời. Vùng tô đỏ là đoạn “làm mãi chưa thấy gì”: công sức vẫn đang tích lũy, chỉ là chưa lộ ra."
        actions={
          <>
            <Segmented
              ariaLabel="Thang đo trục Y"
              value={logScale ? "log" : "linear"}
              onChange={(v) => setLogScale(v === "log")}
              options={[
                { value: "linear", label: "Xem bình thường" },
                { value: "log", label: "Phóng to đoạn đầu", title: "Nhìn rõ giai đoạn đầu, khi con số còn nhỏ." },
              ]}
            />
            <Segmented
              ariaLabel="Hiện kịch bản tệ đi"
              value={showDecline ? "on" : "off"}
              onChange={(v) => setShowDecline(v === "on")}
              options={[
                { value: "off", label: "Ẩn đường tụt lùi" },
                { value: "on", label: `Nếu mỗi ${preset.periodLabel} tụt ${pct(inputs.rate, 1)}` },
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
          <VerdictGate
            impact={
              tippingPoint !== null && safeQuit < tippingPoint
                ? {
                    teaser: `Điểm bạn định dừng nằm rất gần một mốc quan trọng. Xem đó là mốc gì.`,
                    headline: `Bạn vừa tránh bỏ cuộc đúng lúc sắp lời: chỉ cần trụ thêm ${Math.ceil(tippingPoint - safeQuit)} ${preset.periodLabel}.`,
                  }
                : null
            }
            tool="growth"
            fingerprint={JSON.stringify([inputs, safeQuit])}
            isSample={JSON.stringify(inputs) === JSON.stringify(preset.inputs)}
            summary={
              tippingPoint !== null && safeQuit < tippingPoint
                ? `Đang định dừng ở ${preset.periodLabel} ${safeQuit}, ngay trước lúc bắt đầu lời (${preset.periodLabel} ${Math.ceil(tippingPoint)})`
                : `Dừng ở ${preset.periodLabel} ${safeQuit}: đã qua đoạn khó nhất`
            }
          >
            <GrowthInsights
              inputs={inputs}
              tippingPoint={tippingPoint}
              quitPoint={safeQuit}
              unit={preset.unit}
              periodLabel={preset.periodLabel}
            />
          </VerdictGate>
        </div>
      </Card>
    </div>
  );
}
