import { createRng } from "./random";

export interface MontyHallPoint {
  games: number;
  stay: number;
  switch: number;
}

export interface MontyHallResult {
  series: MontyHallPoint[];
  stayWins: number;
  switchWins: number;
  games: number;
}

/**
 * Generalised Monty Hall: `doors` doors, one prize. The host opens every
 * other non-prize door except one, leaving a single alternative to switch to.
 */
export function simulateMontyHall(games: number, doors: number, seed: number): MontyHallResult {
  const rng = createRng(seed);
  const series: MontyHallPoint[] = [];
  const step = Math.max(1, Math.floor(games / 80));
  let stayWins = 0;
  let switchWins = 0;

  for (let g = 1; g <= games; g++) {
    const prize = Math.floor(rng() * doors);
    const pick = Math.floor(rng() * doors);
    if (pick === prize) stayWins++;
    else switchWins++; // the single remaining closed door must hide the prize

    if (g % step === 0 || g === games) {
      series.push({ games: g, stay: stayWins / g, switch: switchWins / g });
    }
  }
  return { series, stayWins, switchWins, games };
}
