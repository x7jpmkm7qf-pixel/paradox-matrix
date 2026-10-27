/** Shared chart styling so every Recharts figure reads as one system. */
export const chartColors = {
  primary: "#2550eb",
  secondary: "#f59e0b",
  muted: "#91919e",
  danger: "#dc2626",
  success: "#059669",
  grid: "#eeeef0",
  axis: "#737382",
};

export const axisProps = {
  stroke: chartColors.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: { stroke: chartColors.grid },
} as const;

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid #d9d9de",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    fontSize: 12,
    padding: "8px 10px",
  },
  labelStyle: { color: "#18181b", fontWeight: 600, marginBottom: 4 },
} as const;
