import "server-only";
import { parseOrderCode } from "./license";
import { FOUNDER_LATE, PLANS } from "./plans";

interface SepayTransaction {
  id: string | number;
  transaction_date: string;
  amount_in: string | number;
  transaction_content: string;
}

export interface MatchedPayment {
  id: string;
  paidAt: number;
  amount: number;
}

const normalise = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

async function listTransactions(token: string, filters: Record<string, string>): Promise<SepayTransaction[]> {
  const params = new URLSearchParams({ account_number: BANK.account, ...filters });
  const base = process.env.SEPAY_API_BASE ?? "https://my.sepay.vn";
  const res = await fetch(`${base}/userapi/transactions/list?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`SePay ${res.status}`);
  const data = (await res.json()) as { transactions?: SepayTransaction[] };
  return data.transactions ?? [];
}

let cache: { at: number; list: SepayTransaction[] } | null = null;

/** Recent incoming transactions, cached briefly so polling clients stay under SePay's 3 req/s limit. */
async function recentTransactions(token: string): Promise<SepayTransaction[]> {
  if (cache && Date.now() - cache.at < 4_000) return cache.list;
  cache = { at: Date.now(), list: await listTransactions(token, { limit: "200" }) };
  return cache.list;
}

/** No founder seat was sold before this (Vietnam local time, as SePay expects). */
const FOUNDER_LAUNCH = "2026-10-27 00:00:00";
const FOUNDER_PRICES = [PLANS.find((p) => p.id === "founder")!.price, FOUNDER_LATE.price];

let seats: { at: number; sold: number } | null = null;

/** Founder seats paid so far: distinct valid founder order codes in transfers at a founder price; null if SePay is unreachable. */
export async function founderSeatsSold(): Promise<number | null> {
  const token = process.env.SEPAY_API_TOKEN;
  if (!token) return null;
  if (seats && Date.now() - seats.at < 60_000) return seats.sold;
  try {
    const lists = await Promise.all(
      FOUNDER_PRICES.map((price) =>
        listTransactions(token, { amount_in: String(price), transaction_date_min: FOUNDER_LAUNCH, limit: "5000" }),
      ),
    );
    const codes = new Set<string>();
    for (const t of lists.flat()) {
      for (const [code] of normalise(t.transaction_content ?? "").matchAll(/PM[FG][A-Z0-9]{9}/g)) {
        const plan = parseOrderCode(code);
        if (plan?.id === "founder" && Number(t.amount_in) >= plan.price) codes.add(code);
      }
    }
    seats = { at: Date.now(), sold: codes.size };
    return seats.sold;
  } catch {
    return null;
  }
}

/** Finds an incoming transfer whose memo carries the order code and covers the price. */
export async function findPayment(code: string, minAmount: number): Promise<MatchedPayment | null> {
  const token = process.env.SEPAY_API_TOKEN;
  if (!token) return null;
  const list = await recentTransactions(token);
  for (const t of list) {
    const amount = Number(t.amount_in);
    if (amount >= minAmount && normalise(t.transaction_content ?? "").includes(code)) {
      // SePay reports Vietnam local time without an offset.
      const paidAt = Date.parse(`${t.transaction_date.replace(" ", "T")}+07:00`);
      return { id: String(t.id), paidAt: Number.isFinite(paidAt) ? paidAt : Date.now(), amount };
    }
  }
  return null;
}

/** Receiving account shared with tamlyhocvn.club; env vars override. */
export const BANK = {
  id: process.env.BANK_ID || "MB",
  account: process.env.BANK_ACCOUNT_NO || "317405012",
  accountName: process.env.BANK_ACCOUNT_NAME || "NORWAY PHARMATECH AS MEDICINE",
};

export const paymentConfigured = () => Boolean(process.env.SEPAY_API_TOKEN);
