import type { ReactNode } from "react";

type Tone = "danger" | "warning" | "success" | "info";

const tones: Record<Tone, { box: string; dot: string; title: string }> = {
  danger: { box: "border-red-200 bg-red-50", dot: "bg-red-500", title: "text-red-900" },
  warning: { box: "border-amber-200 bg-amber-50", dot: "bg-amber-500", title: "text-amber-900" },
  success: { box: "border-emerald-200 bg-emerald-50", dot: "bg-emerald-500", title: "text-emerald-900" },
  info: { box: "border-accent-200 bg-accent-50", dot: "bg-accent-500", title: "text-accent-900" },
};

interface AlertProps {
  tone: Tone;
  title: ReactNode;
  children?: ReactNode;
}

export function Alert({ tone, title, children }: AlertProps) {
  const t = tones[tone];
  return (
    <div role="status" className={`rounded-xl border p-4 ${t.box}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.dot}`} />
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${t.title}`}>{title}</p>
          {children && <div className="mt-1 text-sm leading-relaxed text-ink-700">{children}</div>}
        </div>
      </div>
    </div>
  );
}
