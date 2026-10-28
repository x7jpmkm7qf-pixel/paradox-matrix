/**
 * Accounts switch on once Supabase is configured (NEXT_PUBLIC_* values are inlined at build time,
 * so the client and server agree). Until then the site keeps the browser-only Pro and trial.
 */
export const ACCOUNTS_ON = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const MIN_PASSWORD = 8;

/** Only same-site paths are allowed as post-login destinations. */
export const safeNext = (raw: string | null | undefined, fallback = "/app") =>
  raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
