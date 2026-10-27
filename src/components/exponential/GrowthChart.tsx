"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { axisProps, chartColors, tooltipStyle } from "@/components/ui/chartTheme";
import type { GrowthPoint } from "@/lib/growth";
import { compact, num } from "@/lib/format";

interface GrowthChartProps {
  data: GrowthPoint[];
  tippingPoint: number | null;
  tippingValue: number | null;
  quitPoint: number;
  periodLabel: string;
  logScale: boolean;
  showDecline: boolean;
}

const SERIES_LABELS: Record<string, string> = {
  exponential: "Thực tế (tăng dồn)",
  linear: "Mức bạn mong đợi",
  decline: "Kịch bản giảm dần",
  valley: "Thung lũng thất vọng",
};

export function GrowthChart({ data, tippingPoint, tippingValue, quitPoint, periodLabel, logScale, showDecline }: GrowthChartProps) {
  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, "dataMax"]}
            {...axisProps}
            tickFormatter={(v: number) => num(v)}
            label={{ value: periodLabel, position: "insideBottomRight", offset: -2, fontSize: 11, fill: chartColors.axis }}
          />
          <YAxis
            {...axisProps}
            scale={logScale ? "log" : "linear"}
            domain={logScale ? ["auto", "auto"] : [0, "auto"]}
            allowDataOverflow={logScale}
            tickFormatter={(v: number) => compact(v)}
            width={56}
          />
          <Tooltip
            {...tooltipStyle}
            labelFormatter={(v) => `${periodLabel} ${num(Number(v))}`}
            formatter={(v: number | [number, number], name: string) =>
              Array.isArray(v) ? [`chênh ${compact(v[1] - v[0])}`, SERIES_LABELS[name]] : [num(v), SERIES_LABELS[name] ?? name]
            }
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} formatter={(v: string) => SERIES_LABELS[v] ?? v} />

          <Area
            dataKey="valley"
            stroke="none"
            fill={chartColors.danger}
            fillOpacity={0.08}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Line dataKey="linear" stroke={chartColors.muted} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          {showDecline && <Line dataKey="decline" stroke={chartColors.secondary} strokeWidth={1.5} dot={false} isAnimationActive={false} />}
          <Line dataKey="exponential" stroke={chartColors.primary} strokeWidth={2.5} dot={false} isAnimationActive={false} />

          {quitPoint > 0 && (
            <ReferenceLine
              x={quitPoint}
              stroke={chartColors.danger}
              strokeDasharray="3 3"
              label={{ value: "Thường bỏ cuộc", position: "insideTopLeft", fontSize: 11, fill: chartColors.danger }}
            />
          )}
          {tippingPoint !== null && (
            <ReferenceLine
              x={tippingPoint}
              stroke={chartColors.success}
              strokeDasharray="3 3"
              label={{ value: "Điểm bùng phát", position: "insideTopRight", fontSize: 11, fill: chartColors.success }}
            />
          )}
          {tippingPoint !== null && tippingValue !== null && (
            <ReferenceDot x={tippingPoint} y={tippingValue} r={5} fill={chartColors.success} stroke="#fff" strokeWidth={2} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
