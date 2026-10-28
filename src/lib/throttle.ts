import "server-only";

const hits = new Map<string, number[]>();

/** Per-instance sliding window; enough to stop one client from flooding inboxes. */
export function throttled(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) return true;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return false;
}

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
