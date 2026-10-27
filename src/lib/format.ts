const vnNumber = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });
const vnCompact = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });

export const pct = (value: number, digits = 1): string =>
  `${(value * 100).toFixed(digits).replace(".", ",")}%`;

export const num = (value: number): string => vnNumber.format(value);

export const compact = (value: number): string => vnCompact.format(value);

export const money = (value: number): string => `${vnNumber.format(Math.round(value))} tr`;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
