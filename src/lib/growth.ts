export interface GrowthInputs {
  /** Starting value (followers, revenue, skill score...). */
  start: number;
  /** Compounding rate per period, e.g. 0.01 = 1%. */
  rate: number;
  /** Linear gain expected per period. */
  linearStep: number;
  periods: number;
}

export interface GrowthPoint {
  x: number;
  exponential: number;
  linear: number;
  decline: number;
  /** Gap where reality (exponential) is still below linear expectation. */
  valley: [number, number] | null;
}

/** y = start · a^x, with a = 1 + rate. */
export const exponentialAt = (start: number, rate: number, x: number) => start * Math.pow(1 + rate, x);

export const linearAt = (start: number, step: number, x: number) => start + step * x;

export function buildGrowthSeries(g: GrowthInputs): GrowthPoint[] {
  const points: GrowthPoint[] = [];
  const stride = Math.max(1, Math.ceil(g.periods / 200));
  for (let x = 0; x <= g.periods; x += stride) points.push(pointAt(g, x));
  if (points[points.length - 1]?.x !== g.periods) points.push(pointAt(g, g.periods));
  return points;
}

function pointAt(g: GrowthInputs, x: number): GrowthPoint {
  const exponential = exponentialAt(g.start, g.rate, x);
  const linear = linearAt(g.start, g.linearStep, x);
  const decline = g.start * Math.pow(Math.max(0, 1 - g.rate), x);
  return { x, exponential, linear, decline, valley: exponential < linear ? [exponential, linear] : null };
}

/**
 * Tipping point = the first period (after x=0) where the compounding curve
 * overtakes the linear expectation. Found by bisection on f(x) = exp - lin.
 */
export function findTippingPoint(g: GrowthInputs): number | null {
  const f = (x: number) => exponentialAt(g.start, g.rate, x) - linearAt(g.start, g.linearStep, x);
  // Need a region where f < 0 first (the "valley of disappointment").
  const scan = Math.max(1, g.periods / 2000);
  let lo: number | null = null;
  for (let x = scan; x <= g.periods; x += scan) {
    if (lo === null && f(x) < 0) lo = x;
    if (lo !== null && f(x) >= 0) {
      let a = lo;
      let b = x;
      for (let i = 0; i < 60; i++) {
        const m = (a + b) / 2;
        if (f(m) < 0) a = m;
        else b = m;
      }
      return b;
    }
  }
  return null;
}

/** Period at which the exponential curve reaches `share` of its final value. */
export function periodToReachShare(g: GrowthInputs, share: number): number {
  const final = exponentialAt(g.start, g.rate, g.periods);
  const target = g.start + (final - g.start) * share;
  if (g.rate <= 0) return g.periods;
  return Math.log(target / g.start) / Math.log(1 + g.rate);
}

/** Share of the total gain achieved by a given period. */
export function shareOfGainAt(g: GrowthInputs, x: number): number {
  const final = exponentialAt(g.start, g.rate, g.periods);
  if (final === g.start) return 0;
  return (exponentialAt(g.start, g.rate, x) - g.start) / (final - g.start);
}

export interface GrowthPreset {
  id: string;
  name: string;
  unit: string;
  periodLabel: string;
  inputs: GrowthInputs;
}

export const GROWTH_PRESETS: GrowthPreset[] = [
  {
    id: "content",
    name: "Kênh nội dung",
    unit: "người theo dõi",
    periodLabel: "tuần",
    inputs: { start: 100, rate: 0.08, linearStep: 30, periods: 52 },
  },
  {
    id: "habit",
    name: "Thói quen tốt hơn 1% mỗi ngày",
    unit: "điểm năng lực",
    periodLabel: "ngày",
    inputs: { start: 1, rate: 0.01, linearStep: 0.02, periods: 365 },
  },
  {
    id: "mrr",
    name: "Doanh thu định kỳ (MRR)",
    unit: "triệu đồng",
    periodLabel: "tháng",
    inputs: { start: 20, rate: 0.12, linearStep: 8, periods: 36 },
  },
];
