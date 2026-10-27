"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "pm_license";

interface ProState {
  /** null while the stored license is still being checked. */
  isPro: boolean | null;
  plan: string | null;
  expiresAt: number | null;
  activate: (license: string) => Promise<boolean>;
  deactivate: () => void;
}

const ProContext = createContext<ProState>({
  isPro: false,
  plan: null,
  expiresAt: null,
  activate: async () => false,
  deactivate: () => undefined,
});

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

async function check(license: string) {
  const res = await fetch("/api/license", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license }),
  });
  return (await res.json()) as { valid: boolean; plan?: string; expiresAt?: number | null };
}

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const activate = useCallback(async (license: string) => {
    const result = await check(license).catch(() => ({ valid: false }) as const);
    if (!result.valid) return false;
    try {
      localStorage.setItem(STORAGE_KEY, license);
    } catch {
      // Private mode: Pro still works for this tab.
    }
    setIsPro(true);
    setPlan(result.plan ?? null);
    setExpiresAt(result.expiresAt ?? null);
    return true;
  }, []);

  const deactivate = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsPro(false);
    setPlan(null);
    setExpiresAt(null);
  }, []);

  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setIsPro(false);
      return;
    }
    activate(stored).then((ok) => {
      if (!ok) setIsPro(false);
    });
  }, [activate]);

  return <ProContext.Provider value={{ isPro, plan, expiresAt, activate, deactivate }}>{children}</ProContext.Provider>;
}

export const usePro = () => useContext(ProContext);
