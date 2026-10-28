/** What a verdict is worth to the user, in money when the tool works in money. */
export interface Impact {
  /** VND difference between following the verdict and doing the opposite; omitted when the tool has no money inputs. */
  vnd?: number;
  /** Shown on the locked verdict, before it is revealed. */
  teaser: string;
  /** Shown above the revealed verdict. */
  headline: string;
}

const vnNumber = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

/** 41_000_000 → "41 triệu", 1_250_000_000 → "1,3 tỷ". */
export function vndWords(vnd: number): string {
  const abs = Math.abs(vnd);
  if (abs >= 1e9) return `${vnNumber.format(vnd / 1e9)} tỷ đồng`;
  if (abs >= 1e6) return `${vnNumber.format(vnd / 1e6)} triệu đồng`;
  return `${vnNumber.format(Math.round(vnd))}đ`;
}

const STORAGE_KEY = "pm_impact";
const EVENT = "pm-impact";

type Ledger = Record<string, number>;

function hash(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function readLedger(): Ledger {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Ledger;
  } catch {
    return {};
  }
}

/** Remembers a revealed verdict; the same tool and numbers count once. */
export function recordImpact(tool: string, fingerprint: string, impact: Impact) {
  const ledger = readLedger();
  const key = `${tool}:${hash(fingerprint)}`;
  if (key in ledger) return;
  ledger[key] = Math.max(0, impact.vnd ?? 0);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(EVENT));
}

export interface ImpactTotals {
  vnd: number;
  /** Verdicts that found a trap or a money gap. */
  count: number;
}

export function readTotals(): ImpactTotals {
  const values = Object.values(readLedger());
  return { vnd: values.reduce((a, b) => a + b, 0), count: values.length };
}

export const IMPACT_EVENT = EVENT;
