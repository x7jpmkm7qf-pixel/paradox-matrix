"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, format = String, hint }: SliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink-700">{label}</span>
        <span className="font-mono text-sm tabular-nums text-ink-900">{format(value)}</span>
      </span>
      <input
        type="range"
        className="pm-range mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className="mt-1 block text-xs leading-relaxed text-ink-500">{hint}</span>}
    </label>
  );
}
