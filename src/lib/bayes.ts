import { createRng } from "./random";

export interface BayesInputs {
  /** Base rate: P(success) before any new evidence. */
  prior: number;
  /** P(positive signal | project really succeeds). */
  sensitivity: number;
  /** P(positive signal | project fails) – the false-alarm rate. */
  falsePositive: number;
  /** Did the user observe the positive signal? */
  signalObserved: boolean;
}

export interface BayesResult {
  posterior: number;
  /** Probability of observing the evidence that was actually observed. */
  evidenceProbability: number;
  /** Likelihood ratio of the observed evidence. */
  likelihoodRatio: number;
}

/** Exact application of Bayes' theorem. */
export function computePosterior({ prior, sensitivity, falsePositive, signalObserved }: BayesInputs): BayesResult {
  const pEgivenH = signalObserved ? sensitivity : 1 - sensitivity;
  const pEgivenNotH = signalObserved ? falsePositive : 1 - falsePositive;
  const evidenceProbability = pEgivenH * prior + pEgivenNotH * (1 - prior);
  const posterior = evidenceProbability === 0 ? prior : (pEgivenH * prior) / evidenceProbability;
  const likelihoodRatio = pEgivenNotH === 0 ? Infinity : pEgivenH / pEgivenNotH;
  return { posterior, evidenceProbability, likelihoodRatio };
}

export interface NaturalFrequencies {
  population: number;
  successes: number;
  failures: number;
  truePositives: number;
  falsePositives: number;
}

/** Turns probabilities into "out of 1,000 similar projects" counts – easier to reason about. */
export function naturalFrequencies(inputs: BayesInputs, population = 1000): NaturalFrequencies {
  const successes = Math.round(population * inputs.prior);
  const failures = population - successes;
  const sens = inputs.signalObserved ? inputs.sensitivity : 1 - inputs.sensitivity;
  const fpr = inputs.signalObserved ? inputs.falsePositive : 1 - inputs.falsePositive;
  return {
    population,
    successes,
    failures,
    truePositives: Math.round(successes * sens),
    falsePositives: Math.round(failures * fpr),
  };
}

export interface MonteCarloPoint {
  trials: number;
  estimate: number;
  exact: number;
}

/**
 * Simulates many projects, keeps only those where the observed evidence appeared,
 * and tracks the running share of real successes among them.
 */
export function simulatePosterior(inputs: BayesInputs, trials: number, seed: number): MonteCarloPoint[] {
  const rng = createRng(seed);
  const { posterior: exact } = computePosterior(inputs);
  const points: MonteCarloPoint[] = [];
  const step = Math.max(1, Math.floor(trials / 60));
  let matching = 0;
  let matchingSuccess = 0;

  for (let i = 1; i <= trials; i++) {
    const success = rng() < inputs.prior;
    const signal = rng() < (success ? inputs.sensitivity : inputs.falsePositive);
    if (signal === inputs.signalObserved) {
      matching++;
      if (success) matchingSuccess++;
    }
    if (i % step === 0 || i === trials) {
      points.push({ trials: i, estimate: matching ? matchingSuccess / matching : 0, exact });
    }
  }
  return points;
}

export interface DecisionInputs {
  posterior: number;
  /** Money already spent – unrecoverable. */
  sunkCost: number;
  /** Additional money still needed to finish. */
  remainingCost: number;
  /** Payoff if the project succeeds. */
  payoff: number;
  /** Net value of the best alternative use of the same resources (opportunity cost). */
  alternativeValue: number;
}

export type Verdict = "continue" | "stop" | "sunk-cost-trap";

export interface DecisionResult {
  evContinue: number;
  evStop: number;
  /** The comparison a sunk-cost-biased brain makes: stopping "loses" the sunk money. */
  biasedEvStop: number;
  verdict: Verdict;
  /** Minimum success probability for continuing to beat the alternative. */
  breakEvenProbability: number;
}

/** Forward-looking expected-value comparison; sunk cost is deliberately excluded. */
export function evaluateDecision(d: DecisionInputs): DecisionResult {
  const evContinue = d.posterior * d.payoff - d.remainingCost;
  const evStop = d.alternativeValue;
  const biasedEvStop = d.alternativeValue - d.sunkCost;
  const breakEvenProbability = d.payoff > 0 ? (d.remainingCost + d.alternativeValue) / d.payoff : 1;

  let verdict: Verdict;
  if (evContinue >= evStop) verdict = "continue";
  else if (evContinue >= biasedEvStop) verdict = "sunk-cost-trap";
  else verdict = "stop";

  return { evContinue, evStop, biasedEvStop, verdict, breakEvenProbability };
}
