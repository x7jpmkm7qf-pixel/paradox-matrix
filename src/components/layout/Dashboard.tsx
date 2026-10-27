"use client";

import { useEffect, useState } from "react";
import { ModuleNav } from "./ModuleNav";
import { BayesEngine } from "@/components/bayes/BayesEngine";
import { SimpsonAudit } from "@/components/simpson/SimpsonAudit";
import { ExponentialSimulator } from "@/components/exponential/ExponentialSimulator";
import { MODULES, type ModuleId } from "@/lib/modules";
import { ProButton } from "@/components/pro/ProButton";

const isModuleId = (v: string): v is ModuleId => MODULES.some((m) => m.id === v);

export function Dashboard() {
  const [active, setActive] = useState<ModuleId>("bayes");

  // Keep the active module in the URL hash so each module can be linked directly.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      if (isModuleId(hash)) setActive(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (id: ModuleId) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  const meta = MODULES.find((m) => m.id === active)!;

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-600 print:hidden">
        Chọn bẫy bạn muốn kiểm tra. Mỗi công cụ đã có sẵn số liệu mẫu, bạn chỉ cần thay bằng số của mình.
      </p>
      <div className="print:hidden">
        <ModuleNav active={active} onSelect={select} />
      </div>

      <div>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="hidden text-xs text-ink-500 print:block">Báo cáo The Paradox Matrix · {new Date().toLocaleDateString("vi-VN")}</p>
            <p className="font-mono text-xs text-accent-600">
              Công cụ {meta.index} · {meta.tagline}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">{meta.name}</h2>
            <p className="mt-1 max-w-3xl text-sm text-ink-500">{meta.description}</p>
          </div>
          <div className="print:hidden">
            <ProButton feature="Xuất báo cáo PDF" onClick={() => window.print()}>
              Xuất báo cáo PDF
            </ProButton>
          </div>
        </div>
        <HowTo steps={meta.steps} />
        {active === "bayes" && <BayesEngine />}
        {active === "simpson" && <SimpsonAudit />}
        {active === "exponential" && <ExponentialSimulator />}
      </div>
    </div>
  );
}

function HowTo({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="mb-5 grid gap-3 rounded-2xl border border-accent-200 bg-accent-50/60 p-4 sm:grid-cols-3 print:hidden">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3 text-sm leading-relaxed text-ink-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
            {i + 1}
          </span>
          {s}
        </li>
      ))}
    </ol>
  );
}
