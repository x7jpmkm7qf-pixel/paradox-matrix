import "server-only";

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

let cache: { at: number; list: SepayTransaction[] } | null = null;

/** Recent incoming transactions, cached briefly so polling clients stay under SePay's 3 req/s limit. */
async function recentTransactions(token: string): Promise<SepayTransaction[]> {
  if (cache && Date.now() - cache.at < 4_000) return cache.list;
  const params = new URLSearchParams({ limit: "200" });
  params.set("account_number", BANK.account);
  const base = process.env.SEPAY_API_BASE ?? "https://my.sepay.vn";
  const res = await fetch(`${base}/userapi/transactions/list?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`SePay ${res.status}`);
  const data = (await res.json()) as { transactions?: SepayTransaction[] };
  cache = { at: Date.now(), list: data.transactions ?? [] };
  return cache.list;
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
