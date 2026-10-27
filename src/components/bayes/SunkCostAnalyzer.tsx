"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { NumberField } from "@/components/ui/NumberField";
import { Alert } from "@/components/ui/Alert";
import { axisProps, chartColors, tooltipStyle } from "@/components/ui/chartTheme";
import { evaluateDecision } from "@/lib/bayes";
import { money, pct } from "@/lib/format";

interface SunkCostAnalyzerProps {
  posterior: number;
}

export function SunkCostAnalyzer({ posterior }: SunkCostAnalyzerProps) {
  const [sunkCost, setSunkCost] = useState(500);
  const [remainingCost, setRemainingCost] = useState(300);
  const [payoff, setPayoff] = useState(1200);
  const [alternativeValue, setAlternativeValue] = useState(250);

  const decision = useMemo(
    () => evaluateDecision({ posterior, sunkCost, remainingCost, payoff, alternativeValue }),
    [posterior, sunkCost, remainingCost, payoff, alternativeValue],
  );

  const chartData = [
    { name: "Tiếp tục", value: decision.evContinue, key: "continue" },
    { name: "Dừng & chuyển hướng", value: decision.evStop, key: "stop" },
    { name: "Dừng (góc nhìn bị chi phí chìm)", value: decision.biasedEvStop, key: "biased" },
  ];

  return (
    <Card
      title="Kiểm tra bẫy chi phí chìm"
      subtitle={`So sánh giá trị kỳ vọng hướng tới tương lai, dùng xác suất sau cập nhật: ${pct(posterior)}. Đơn vị: triệu đồng.`}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="grid grid-cols-2 content-start gap-4">
          <NumberField label="Đã chi (chi phí chìm)" value={sunkCost} onChange={setSunkCost} suffix="tr" step={10} hint="Không lấy lại được." />
          <NumberField label="Cần chi thêm" value={remainingCost} onChange={setRemainingCost} suffix="tr" step={10} hint="Để hoàn thành dự án." />
          <NumberField label="Lợi nhuận nếu thành công" value={payoff} onChange={setPayoff} suffix="tr" step={10} />
          <NumberField
            label="Phương án thay thế tốt nhất"
            value={alternativeValue}
            onChange={setAlternativeValue}
            suffix="tr"
            step={10}
            hint="Chi phí cơ hội: lãi ròng nếu dồn tiền, thời gian sang việc khác."
          />
        </div>

        <div className="space-y-4">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -4 }}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="name" {...axisProps} interval={0} tick={{ fontSize: 11 }} />
                <YAxis {...axisProps} tickFormatter={(v: number) => money(v)} width={64} />
                <ReferenceLine y={0} stroke={chartColors.axis} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "#f7f7f8" }} formatter={(v: number) => [money(v), "Giá trị kỳ vọng"]} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={72}>
                  {chartData.map((d) => (
                    <Cell
                      key={d.key}
                      fill={d.key === "continue" ? chartColors.primary : d.key === "stop" ? chartColors.success : "#d9d9de"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <VerdictAlert
            verdict={decision.verdict}
            evContinue={decision.evContinue}
            evStop={decision.evStop}
            sunkCost={sunkCost}
            remainingCost={remainingCost}
          />

          <p className="text-xs leading-relaxed text-ink-500">
            Ngưỡng hòa vốn: dự án cần xác suất thành công tối thiểu{" "}
            <b className="font-mono text-ink-700">{pct(Math.min(1, Math.max(0, decision.breakEvenProbability)))}</b> mới đáng
            để tiếp tục. Khoản {money(sunkCost)} đã chi không xuất hiện trong phép tính này, vì nó giống nhau ở mọi lựa chọn.
          </p>
        </div>
      </div>
    </Card>
  );
}

interface VerdictAlertProps {
  verdict: ReturnType<typeof evaluateDecision>["verdict"];
  evContinue: number;
  evStop: number;
  sunkCost: number;
  remainingCost: number;
}

function VerdictAlert({ verdict, evContinue, evStop, sunkCost, remainingCost }: VerdictAlertProps) {
  if (verdict === "continue") {
    return (
      <Alert tone="success" title="Tiếp tục là lựa chọn hợp lý">
        Giá trị kỳ vọng nếu đi tiếp ({money(evContinue)}) cao hơn phương án thay thế ({money(evStop)}), kể cả khi bỏ qua số tiền đã
        chi.
      </Alert>
    );
  }
  if (verdict === "sunk-cost-trap") {
    return (
      <Alert tone="danger" title="Cảnh báo: bạn đang ở vùng bẫy chi phí chìm">
        Nhìn về tương lai, dừng lại tốt hơn {money(evStop - evContinue)}. Lý do duy nhất khiến &quot;tiếp tục&quot; có vẻ hấp dẫn là
        cảm giác mất trắng {money(sunkCost)} đã bỏ ra. Số tiền đó đã mất dù bạn chọn gì. Hãy tự hỏi: nếu hôm nay mới bắt đầu, tôi có
        rót thêm {money(remainingCost)} vào dự án này không?
      </Alert>
    );
  }
  return (
    <Alert tone="warning" title="Nên dừng hoặc chuyển hướng">
      Ngay cả khi tính cả cảm giác tiếc tiền, đi tiếp vẫn kém phương án thay thế. Cắt lỗ và dồn nguồn lực sang hướng khác.
    </Alert>
  );
}
