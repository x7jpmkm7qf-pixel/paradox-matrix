"use client";

import { MODULES, type ModuleId } from "@/lib/modules";

interface ModuleNavProps {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
}

export function ModuleNav({ active, onSelect }: ModuleNavProps) {
  return (
    <nav aria-label="Các module" className="grid gap-3 md:grid-cols-3">
      {MODULES.map((m) => {
        const selected = m.id === active;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            aria-current={selected ? "page" : undefined}
            className={`group rounded-2xl border p-4 text-left transition ${
              selected
                ? "border-ink-900 bg-ink-900 text-white shadow-lg shadow-ink-900/10"
                : "border-ink-200 bg-white hover:border-ink-300 hover:shadow-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs ${selected ? "text-accent-300" : "text-accent-600"}`}>Module {m.index}</span>
              <span className={`text-xs ${selected ? "text-ink-300" : "text-ink-400 group-hover:text-ink-600"}`}>→</span>
            </div>
            <p className={`mt-2 text-sm font-semibold tracking-tight ${selected ? "text-white" : "text-ink-900"}`}>{m.tagline}</p>
            <p className={`mt-0.5 text-xs ${selected ? "text-ink-300" : "text-ink-500"}`}>{m.name}</p>
          </button>
        );
      })}
    </nav>
  );
}
