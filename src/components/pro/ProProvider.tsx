"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ACCOUNTS_ON } from "@/lib/accounts";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabase/client";

const STORAGE_KEY = "pm_license";

export interface Trial {
  used: number;
  left: number;
  unlocked: Record<string, string>;
  leadDone: boolean;
}

interface Account {
  email: string;
  pro: { plan: string; expiresAt: number | null; code: string; founderGroup: string | null } | null;
  trial: Trial;
}

interface ProState {
  /** null while the stored license or session is still being checked. */
  isPro: boolean | null;
  plan: string | null;
  expiresAt: number | null;
  /** Zalo group invite link, only for founder licenses. */
  founderGroup: string | null;
  /** Signed-in email; always null when accounts are off. */
  email: string | null;
  /** Server-side free verdicts of the signed-in account. */
  trial: Trial | null;
  setTrial: (trial: Trial) => void;
  /** Adds a paid license; resolves to an error message, or null on success. */
  activate: (license: string) => Promise<string | null>;
  deactivate: () => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const ProContext = createContext<ProState>({
  isPro: false,
  plan: null,
  expiresAt: null,
  founderGroup: null,
  email: null,
  trial: null,
  setTrial: () => undefined,
  activate: async () => null,
  deactivate: () => undefined,
  refresh: async () => undefined,
  signOut: async () => undefined,
});

const storage = {
  get: () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (v: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // Private mode: Pro still works for this tab.
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

async function check(license: string) {
  const res = await fetch("/api/license", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license }),
  });
  return (await res.json()) as { valid: boolean; plan?: string; expiresAt?: number | null; founderGroup?: string | null };
}

async function claim(license: string) {
  const res = await fetch("/api/account/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license }),
  });
  return (await res.json()) as { account?: Account; error?: string; reason?: string };
}

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [founderGroup, setFounderGroup] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);

  const apply = useCallback((pro: Account["pro"] | null, account: Account | null) => {
    setIsPro(Boolean(pro));
    setPlan(pro?.plan ?? null);
    setExpiresAt(pro?.expiresAt ?? null);
    setFounderGroup(pro?.founderGroup ?? null);
    setEmail(account?.email ?? null);
    setTrial(account?.trial ?? null);
  }, []);

  /** Accounts mode: load the signed-in account and move any browser-only license onto it. */
  const refresh = useCallback(async () => {
    if (!ACCOUNTS_ON) return;
    const res = await fetch("/api/account", { cache: "no-store" }).catch(() => null);
    let account = ((await res?.json().catch(() => null)) as { account: Account | null } | null)?.account ?? null;
    const legacy = storage.get();
    if (account && legacy) {
      const result = await claim(legacy).catch(() => null);
      if (result?.account) account = result.account;
      if (result?.account || result?.reason) storage.clear();
    }
    apply(account?.pro ?? null, account);
  }, [apply]);

  const activate = useCallback(
    async (license: string) => {
      if (ACCOUNTS_ON) {
        // Keep it on the device until it is safely attached to an account.
        storage.set(license);
        if (!email) {
          await refresh();
          if (!storage.get()) return null;
          return "Bạn đăng nhập để gắn gói Pro vào tài khoản nhé.";
        }
        const result = await claim(license).catch(() => ({ error: "Mạng lỗi, bạn thử lại nhé." }) as const);
        if ("account" in result && result.account) {
          storage.clear();
          apply(result.account.pro, result.account);
          return null;
        }
        if ("reason" in result && result.reason) storage.clear();
        return result.error ?? "Có lỗi xảy ra.";
      }
      const result = await check(license).catch(() => ({ valid: false }) as const);
      if (!result.valid) return "Mã không hợp lệ hoặc đã hết hạn.";
      storage.set(license);
      setIsPro(true);
      setPlan(result.plan ?? null);
      setExpiresAt(result.expiresAt ?? null);
      setFounderGroup(result.founderGroup ?? null);
      return null;
    },
    [apply, email, refresh],
  );

  const deactivate = useCallback(() => {
    storage.clear();
    apply(null, null);
  }, [apply]);

  const signOut = useCallback(async () => {
    if (!ACCOUNTS_ON) return;
    await supabaseBrowser().auth.signOut();
    apply(null, null);
  }, [apply]);

  useEffect(() => {
    if (ACCOUNTS_ON) {
      void refresh();
      const { data } = supabaseBrowser().auth.onAuthStateChange((event: AuthChangeEvent) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") void refresh();
      });
      return () => data.subscription.unsubscribe();
    }
    const stored = storage.get();
    if (!stored) {
      setIsPro(false);
      return;
    }
    activate(stored).then((err) => {
      if (err) setIsPro(false);
    });
    // Browser-only mode: check the stored license once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProContext.Provider
      value={{ isPro, plan, expiresAt, founderGroup, email, trial, setTrial, activate, deactivate, refresh, signOut }}
    >
      {children}
    </ProContext.Provider>
  );
}

export const usePro = () => useContext(ProContext);
