"use client";

import { useEffect, useState } from "react";
import { ModuleNav } from "./ModuleNav";
import { BayesEngine } from "@/components/bayes/BayesEngine";
import { SimpsonAudit } from "@/components/simpson/SimpsonAudit";
import { ExponentialSimulator } from "@/components/exponential/ExponentialSimulator";
import { MODULES, type ModuleId } from "@/lib/modules";

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
      <ModuleNav active={active} onSelect={select} />

      <div>
        <div className="mb-5">
          <p className="font-mono text-xs text-accent-600">Module {meta.index}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">{meta.name}</h2>
          <p className="mt-1 max-w-3xl text-sm text-ink-500">{meta.description}</p>
        </div>
        {active === "bayes" && <BayesEngine />}
        {active === "simpson" && <SimpsonAudit />}
        {active === "exponential" && <ExponentialSimulator />}
      </div>
    </div>
  );
}
