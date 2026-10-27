"use client";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
  hint?: string;
}

export function NumberField({ label, value, onChange, min = 0, step = 1, suffix, hint }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <span className="mt-1.5 flex items-center rounded-lg border border-ink-200 bg-white focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100">
        <input
          type="number"
          inputMode="decimal"
          className="w-full rounded-lg bg-transparent px-3 py-2 font-mono text-sm tabular-nums text-ink-900 outline-none"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
        {suffix && <span className="pr-3 text-xs text-ink-500">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-xs leading-relaxed text-ink-500">{hint}</span>}
    </label>
  );
}
