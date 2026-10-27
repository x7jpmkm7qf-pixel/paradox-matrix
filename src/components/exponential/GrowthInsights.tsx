import { Alert } from "@/components/ui/Alert";
import { Stat } from "@/components/ui/Stat";
import { exponentialAt, linearAt, periodToReachShare, shareOfGainAt, type GrowthInputs } from "@/lib/growth";
import { compact, num, pct } from "@/lib/format";

interface GrowthInsightsProps {
  inputs: GrowthInputs;
  tippingPoint: number | null;
  quitPoint: number;
  unit: string;
  periodLabel: string;
}

export function GrowthInsights({ inputs, tippingPoint, quitPoint, unit, periodLabel }: GrowthInsightsProps) {
  const final = exponentialAt(inputs.start, inputs.rate, inputs.periods);
  const linearFinal = linearAt(inputs.start, inputs.linearStep, inputs.periods);
  const halfTimeShare = shareOfGainAt(inputs, inputs.periods / 2);
  const tenPctAt = periodToReachShare(inputs, 0.1);
  const atQuit = exponentialAt(inputs.start, inputs.rate, quitPoint);
  const quitBeforeTipping = tippingPoint !== null && quitPoint < tippingPoint;
  const multiplier = Math.pow(1 + inputs.rate, inputs.periods);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Điểm bùng phát"
          value={tippingPoint !== null ? `${periodLabel} ${num(Math.ceil(tippingPoint))}` : "Không có"}
          caption={tippingPoint !== null ? "Lúc thực tế vượt mức bạn mong đợi" : "Thực tế luôn cao hơn, hoặc chưa kịp vượt"}
          emphasis
        />
        <Stat label="Kết quả cuối kỳ" value={compact(final)} caption={`${unit} · gấp ${compact(multiplier)} lần ban đầu`} />
        <Stat label="Nếu tăng đều như mong" value={compact(linearFinal)} caption={`${unit} · chênh ${compact(final - linearFinal)}`} />
        <Stat label="Nửa chặng đường" value={pct(halfTimeShare, 0)} caption={`Mới đạt chừng này phần tăng trưởng sau 50% thời gian`} />
      </div>

      <Alert tone="info" title="Giai đoạn phẳng là bình thường, không phải thất bại">
        Phải mất tới <b>{num(Math.ceil(tenPctAt))}</b>/{num(inputs.periods)} {periodLabel} ({pct(tenPctAt / inputs.periods, 0)} thời gian)
        bạn mới đạt 10% kết quả cuối cùng. 90% còn lại dồn vào giai đoạn sau.
      </Alert>

      {quitBeforeTipping ? (
        <Alert tone="danger" title={`Bỏ cuộc ở ${periodLabel} ${num(quitPoint)} là dừng ngay trước điểm bùng phát`}>
          Lúc đó bạn có {compact(Math.round(atQuit * 100) / 100)} {unit}, ít hơn mức bạn mong đợi (
          {compact(linearAt(inputs.start, inputs.linearStep, quitPoint))}), nên cảm giác &quot;không hiệu quả&quot; là có thật. Nhưng chỉ
          cần trụ thêm {num(Math.ceil(tippingPoint! - quitPoint))} {periodLabel} là vượt qua, và cuối kỳ đạt {compact(final)}, gấp{" "}
          {compact(final / Math.max(atQuit, 1e-9))} lần thời điểm bỏ cuộc.
        </Alert>
      ) : (
        <Alert tone="success" title={`Dừng ở ${periodLabel} ${num(quitPoint)}: đã qua vùng thất vọng`}>
          Tại thời điểm này bạn có {compact(atQuit)} {unit}, tức {pct(shareOfGainAt(inputs, quitPoint), 0)} kết quả cuối kỳ. Mỗi kỳ tiếp
          theo đóng góp nhiều hơn tất cả các kỳ đầu cộng lại.
        </Alert>
      )}
    </div>
  );
}
