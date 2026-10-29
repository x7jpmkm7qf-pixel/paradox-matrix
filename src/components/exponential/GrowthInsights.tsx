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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
          label={`${cap(periodLabel)} bạn bắt đầu lời`}
          value={tippingPoint !== null ? `${periodLabel} ${num(Math.ceil(tippingPoint))}` : "Không có"}
          caption={
            tippingPoint !== null
              ? "Từ đây kết quả thật vượt mức bạn mong"
              : "Kết quả luôn hơn mong đợi, hoặc chưa kịp vượt trong khoảng đang xem"
          }
          emphasis
        />
        <Stat
          label={`Sau ${num(inputs.periods)} ${periodLabel} bạn có`}
          value={compact(final)}
          caption={`${unit} · gấp ${compact(multiplier)} lần hôm nay`}
        />
        <Stat
          label="Nếu chỉ cộng đều như bạn nghĩ"
          value={compact(linearFinal)}
          caption={`${unit} · ${final >= linearFinal ? "ít hơn" : "nhiều hơn"} thực tế ${compact(Math.abs(final - linearFinal))}`}
        />
        <Stat
          label="Đi được nửa đường, bạn mới có"
          value={pct(halfTimeShare, 0)}
          caption="thành quả cuối cùng. Phần lớn dồn về nửa sau."
        />
      </div>

      <Alert tone="info" title="Đoạn đầu chậm là bình thường, không phải bạn làm sai">
        Phải mất tới <b>{num(Math.ceil(tenPctAt))}</b>/{num(inputs.periods)} {periodLabel} ({pct(tenPctAt / inputs.periods, 0)} thời gian)
        bạn mới đạt 10% thành quả cả chặng. 90% còn lại dồn vào giai đoạn sau.
      </Alert>

      {quitBeforeTipping ? (
        <Alert tone="danger" title={`Dừng ở ${periodLabel} ${num(quitPoint)} là bỏ đúng lúc sắp lời`}>
          Chỉ cần trụ thêm <b>{num(Math.ceil(tippingPoint! - quitPoint))} {periodLabel}</b> là vượt qua, và sau{" "}
          {num(inputs.periods)} {periodLabel} bạn có {compact(final)} {unit}, gấp {compact(final / Math.max(atQuit, 1e-9))} lần lúc định
          dừng. Lúc định dừng bạn mới có {compact(Math.round(atQuit * 100) / 100)} {unit}, ít hơn mức bạn mong (
          {compact(linearAt(inputs.start, inputs.linearStep, quitPoint))}), nên cảm giác &quot;không hiệu quả&quot; là có thật.
        </Alert>
      ) : (
        <Alert tone="success" title={`Dừng ở ${periodLabel} ${num(quitPoint)}: bạn đã qua đoạn khó nhất`}>
          Tại thời điểm này bạn có {compact(atQuit)} {unit}, tức {pct(shareOfGainAt(inputs, quitPoint), 0)} thành quả cả chặng. Mỗi kỳ tiếp
          theo đóng góp nhiều hơn tất cả các kỳ đầu cộng lại.
        </Alert>
      )}
    </div>
  );
}
