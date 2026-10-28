import "server-only";
import { ensureSchema, sql } from "./db";
import { verifyLicense } from "./license";
import { findAnyPlan } from "./plans";
import { FREE_VERDICTS } from "./trial";

/** Founder-only Zalo group; served only to founder accounts so the link stays out of the public bundle. */
export const FOUNDER_GROUP = process.env.FOUNDER_ZALO_GROUP_URL || "https://zalo.me/g/tet5i5a0matf9i72bcqv";

export interface TrialView {
  used: number;
  left: number;
  /** Hashed input fingerprint last unlocked per tool. */
  unlocked: Record<string, string>;
  leadDone: boolean;
}

export interface AccountView {
  email: string;
  pro: { plan: string; expiresAt: number | null; code: string; founderGroup: string | null } | null;
  trial: TrialView;
}

interface AccountRow {
  trial_used: number;
  trial_unlocked: Record<string, string>;
  lead_done: boolean;
}

const trialView = (row: AccountRow): TrialView => ({
  used: row.trial_used,
  left: Math.max(0, FREE_VERDICTS - row.trial_used),
  unlocked: row.trial_unlocked ?? {},
  leadDone: row.lead_done,
});

async function accountRow(userId: string): Promise<AccountRow> {
  await ensureSchema();
  const [row] = await sql<AccountRow[]>`
    insert into pm_accounts (user_id) values (${userId})
    on conflict (user_id) do update set user_id = excluded.user_id
    returning trial_used, trial_unlocked, lead_done`;
  return row;
}

export async function loadAccount(userId: string, email: string): Promise<AccountView> {
  const row = await accountRow(userId);
  // Best active license: lifetime first, then the one that runs longest.
  const [lic] = await sql<{ order_code: string; plan: string; expires_at: Date | null }[]>`
    select order_code, plan, expires_at from pm_licenses
    where user_id = ${userId} and (expires_at is null or expires_at > now())
    order by expires_at desc nulls first limit 1`;
  return {
    email,
    pro: lic
      ? {
          plan: lic.plan,
          expiresAt: lic.expires_at ? lic.expires_at.getTime() : null,
          code: lic.order_code,
          founderGroup: lic.plan === "founder" ? FOUNDER_GROUP : null,
        }
      : null,
    trial: trialView(row),
  };
}

export type ClaimResult = "ok" | "invalid" | "taken";

/** Attaches a paid license to the account; an order code can belong to one account only. */
export async function claimLicense(userId: string, token: string): Promise<ClaimResult> {
  const payload = verifyLicense(token);
  if (!payload || !findAnyPlan(payload.p)) return "invalid";
  await ensureSchema();
  await sql`
    insert into pm_licenses (order_code, user_id, plan, paid_at, expires_at)
    values (${payload.c}, ${userId}, ${payload.p}, ${new Date(payload.i)}, ${payload.e ? new Date(payload.e) : null})
    on conflict (order_code) do nothing`;
  const [owner] = await sql<{ user_id: string }[]>`select user_id from pm_licenses where order_code = ${payload.c}`;
  return owner?.user_id === userId ? "ok" : "taken";
}

/** Spends one free verdict for this tool and input hash, unless it is already unlocked or none are left. */
export async function spendTrial(userId: string, tool: string, hash: string): Promise<TrialView> {
  await accountRow(userId);
  const [row] = await sql<AccountRow[]>`
    update pm_accounts set
      trial_used = trial_used + 1,
      trial_unlocked = trial_unlocked || jsonb_build_object(${tool}::text, ${hash}::text)
    where user_id = ${userId} and trial_used < ${FREE_VERDICTS}
      and coalesce(trial_unlocked ->> ${tool}, '') <> ${hash}
    returning trial_used, trial_unlocked, lead_done`;
  return trialView(row ?? (await accountRow(userId)));
}

export async function markLeadDone(userId: string) {
  await accountRow(userId);
  await sql`update pm_accounts set lead_done = true where user_id = ${userId}`;
}

/** Looks up a user by email in Supabase's own table. */
export async function findUserByEmail(email: string) {
  const [user] = await sql<{ id: string; email_confirmed_at: Date | null }[]>`
    select id, email_confirmed_at from auth.users where lower(email) = lower(${email}) limit 1`;
  return user ?? null;
}
