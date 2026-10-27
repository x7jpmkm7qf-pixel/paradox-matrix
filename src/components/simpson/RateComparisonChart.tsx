"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, chartColors, tooltipStyle } from "@/components/ui/chartTheme";
import type { SimpsonReport } from "@/lib/simpson";
import { pct } from "@/lib/format";

interface RateComparisonChartProps {
  report: SimpsonReport;
  labelA: string;
  labelB: string;
}

export function RateComparisonChart({ report, labelA, labelB }: RateComparisonChartProps) {
  const data = [
    ...report.segments.map((s) => ({ name: s.segment, A: s.aRate, B: s.bRate })),
    { name: "TỔNG HỢP", A: report.total.aRate, B: report.total.bRate },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barGap={4}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="name" {...axisProps} interval={0} />
          <YAxis {...axisProps} tickFormatter={(v: number) => pct(v, 0)} />
          <Tooltip
            {...tooltipStyle}
            cursor={{ fill: "#f7f7f8" }}
            formatter={(v: number, name) => [pct(v), name === "A" ? labelA : labelB]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === "A" ? labelA : labelB)} />
          <Bar dataKey="A" fill={chartColors.primary} radius={[4, 4, 0, 0]} maxBarSize={44} />
          <Bar dataKey="B" fill={chartColors.secondary} radius={[4, 4, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
