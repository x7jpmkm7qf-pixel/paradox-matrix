import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  emphasis?: boolean;
}

export function Stat({ label, value, caption, emphasis = false }: StatProps) {
  return (
    <div className={`rounded-xl border p-4 ${emphasis ? "border-accent-200 bg-accent-50/60" : "border-ink-200 bg-ink-50/60"}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${emphasis ? "text-accent-700" : "text-ink-900"}`}>
        {value}
      </p>
      {caption && <p className="mt-1 text-xs leading-relaxed text-ink-500">{caption}</p>}
    </div>
  );
}
