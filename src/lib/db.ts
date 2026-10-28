import "server-only";
import postgres from "postgres";

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;

/** Direct Postgres connection (Supabase pooler, so no prepared statements). */
export const sql = url ? postgres(url, { prepare: false, max: 3, idle_timeout: 20 }) : (null as unknown as postgres.Sql);

let ready: Promise<unknown> | null = null;

/** Creates the app's tables on first use, so setup needs no SQL pasted by hand. */
export function ensureSchema() {
  if (!url) throw new Error("POSTGRES_URL is not set");
  ready ??= sql
    .unsafe(
      `create table if not exists pm_accounts (
         user_id uuid primary key references auth.users(id) on delete cascade,
         trial_used int not null default 0,
         trial_unlocked jsonb not null default '{}'::jsonb,
         lead_done boolean not null default false,
         created_at timestamptz not null default now()
       );
       create table if not exists pm_licenses (
         order_code text primary key,
         user_id uuid not null references auth.users(id) on delete cascade,
         plan text not null,
         paid_at timestamptz not null,
         expires_at timestamptz,
         claimed_at timestamptz not null default now()
       );
       create index if not exists pm_licenses_user on pm_licenses(user_id);
       alter table pm_accounts enable row level security;
       alter table pm_licenses enable row level security;`,
    )
    .catch((e) => {
      ready = null;
      throw e;
    });
  return ready;
}
