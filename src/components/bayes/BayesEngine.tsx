"use client";

import { useMemo, useState } from "react";
import { BayesUpdater } from "./BayesUpdater";
import { SunkCostAnalyzer } from "./SunkCostAnalyzer";
import { MontyHallSimulator } from "./MontyHallSimulator";
import { computePosterior, type BayesInputs } from "@/lib/bayes";

const DEFAULT_INPUTS: BayesInputs = {
  prior: 0.2,
  sensitivity: 0.8,
  falsePositive: 0.3,
  signalObserved: true,
};

/** Module 1 – The Bayes & Monty Hall Decision Engine. */
export function BayesEngine() {
  const [inputs, setInputs] = useState<BayesInputs>(DEFAULT_INPUTS);
  const { posterior } = useMemo(() => computePosterior(inputs), [inputs]);

  return (
    <div className="space-y-6">
      <BayesUpdater inputs={inputs} onChange={setInputs} />
      <SunkCostAnalyzer posterior={posterior} />
      <MontyHallSimulator />
    </div>
  );
}
