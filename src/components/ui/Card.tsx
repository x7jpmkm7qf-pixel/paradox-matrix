import type { ReactNode } from "react";

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, actions, children, className = "" }: CardProps) {
  return (
    <section className={`min-w-0 rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6 ${className}`}>
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-tight text-ink-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
