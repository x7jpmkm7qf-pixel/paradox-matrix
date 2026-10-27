/**
 * Seeded pseudo-random generator (mulberry32).
 * Deterministic output keeps server and client renders identical
 * and makes every simulation reproducible from its seed.
 */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function newSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}
