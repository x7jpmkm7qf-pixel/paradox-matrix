"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePro } from "./ProProvider";
import { track } from "@/lib/pixel";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { FREE_VERDICTS } from "@/lib/trial";
import { AuthPanel } from "@/components/auth/AuthPanel";

export { FREE_VERDICTS };

const STORAGE_KEY = "pm_trial";

interface TrialState {
  used: number;
  /** Last unlocked input fingerprint per tool, so a reload doesn't charge again for the same numbers. */
  unlocked: Record<string, string>;
  leadDone: boolean;
}

const EMPTY: TrialState = { used: 0, unlocked: {}, leadDone: false };

function load(): TrialState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<TrialState>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function save(state: TrialState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode: the trial still works for this tab.
  }
}

interface VerdictGateProps {
  /** Tool id, e.g. "sunk-cost". */
  tool: string;
  /** Serialised inputs the verdict depends on. */
  fingerprint: string;
  /** True while the user is looking at built-in sample data. */
  isSample: boolean;
  /** One-line verdict, sent along with a Zalo lead. */
  summary: string;
  children: ReactNode;
}

interface Gate {
  /** False until the trial state (and, with accounts, the input hash) is known. */
  ready: boolean;
  /** Accounts mode and nobody signed in. */
  signedOut: boolean;
  used: number;
  unlockedHere: boolean;
  leadDone: boolean;
  unlock: () => Promise<void>;
  leadFinished: () => void;
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Free verdicts counted in this browser (no accounts configured). */
function useLocalGate(tool: string, fingerprint: string): Gate {
  const [state, setState] = useState<TrialState | null>(null);
  useEffect(() => setState(load()), []);
  const update = (next: TrialState) => {
    save(next);
    setState(next);
  };
  return {
    ready: state !== null,
    signedOut: false,
    used: state?.used ?? 0,
    unlockedHere: state?.unlocked[tool] === fingerprint,
    leadDone: state?.leadDone ?? false,
    unlock: async () => {
      if (state) update({ ...state, used: state.used + 1, unlocked: { ...state.unlocked, [tool]: fingerprint } });
    },
    leadFinished: () => state && update({ ...state, leadDone: true }),
  };
}

/** Free verdicts counted on the signed-in account; the server only ever sees a hash of the inputs. */
function useAccountGate(tool: string, fingerprint: string): Gate {
  const { email, isPro, trial, setTrial } = usePro();
  const [hash, setHash] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void sha256(`${tool}:${fingerprint}`).then((h) => live && setHash(h));
    return () => {
      live = false;
    };
  }, [tool, fingerprint]);

  const unlock = useCallback(async () => {
    const res = await fetch("/api/account/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, hash }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { trial?: typeof trial } | null;
    if (data?.trial) setTrial(data.trial);
  }, [tool, hash, setTrial]);

  return {
    ready: isPro !== null && (!email || (trial !== null && hash !== null)),
    signedOut: !email,
    used: trial?.used ?? 0,
    unlockedHere: Boolean(hash) && trial?.unlocked[tool] === hash,
    leadDone: trial?.leadDone ?? false,
    unlock,
    leadFinished: () => {
      if (trial) setTrial({ ...trial, leadDone: true });
      void fetch("/api/account/lead", { method: "POST" }).catch(() => undefined);
    },
  };
}

const useGate = ACCOUNTS_ON ? useAccountGate : useLocalGate;

/** Shows the verdict for Pro users and sample data; otherwise spends one of the free verdicts or asks to sign up or upgrade. */
export function VerdictGate({ tool, fingerprint, isSample, summary, children }: VerdictGateProps) {
  const { isPro } = usePro();
  const gate = useGate(tool, fingerprint);
  const [busy, setBusy] = useState(false);

  if (isPro || isSample) return <>{children}</>;
  if (isPro === null || !gate.ready) return <Locked>{children}</Locked>;

  if (gate.signedOut) {
    return (
      <Locked
        tall
        overlay={
          <Overlay>
            <SignUpPrompt />
          </Overlay>
        }
      >
        {children}
      </Locked>
    );
  }

  if (gate.unlockedHere) {
    return (
      <>
        {children}
        {!gate.leadDone && <LeadPrompt tool={tool} summary={summary} onDone={gate.leadFinished} />}
      </>
    );
  }

  const left = Math.max(0, FREE_VERDICTS - gate.used);

  const unlock = async () => {
    setBusy(true);
    await gate.unlock();
    setBusy(false);
    track("ViewContent", { content_name: `Free verdict ${gate.used + 1}/${FREE_VERDICTS}` });
  };

  return (
    <Locked
      overlay={
        <Overlay>
          {left > 0 ? (
            <>
              <p className="font-semibold text-ink-900">Kết luận cho số liệu của bạn đã sẵn sàng</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-600">
                Bạn còn{" "}
                <b>
                  {left}/{FREE_VERDICTS} lượt
                </b>{" "}
                xem miễn phí. Mỗi bộ số mới tính 1 lượt, dữ liệu mẫu thì xem thoải mái.
              </p>
              <button
                type="button"
                onClick={unlock}
                disabled={busy}
                className="mt-4 w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
              >
                Xem kết luận
              </button>
            </>
          ) : (
            <Paywall />
          )}
        </Overlay>
      }
    >
      {children}
    </Locked>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-5 text-center shadow-lg">{children}</div>
    </div>
  );
}

function SignUpPrompt() {
  useEffect(() => track("ViewContent", { content_name: "Signup wall: verdict" }), []);
  return (
    <div className="text-left">
      <p className="mb-3 rounded-lg bg-accent-50 px-3 py-2 text-xs leading-relaxed text-ink-700">
        Kết luận cho số liệu của bạn đã sẵn sàng. Số liệu vẫn ở trên máy bạn, không gửi đi đâu.
      </p>
      <AuthPanel mode="signup" compact />
    </div>
  );
}

function Locked({ children, overlay, tall }: { children: ReactNode; overlay?: ReactNode; tall?: boolean }) {
  return (
    <div className={`relative ${tall ? "min-h-[30rem]" : "min-h-56"}`}>
      <div aria-hidden className="pointer-events-none select-none blur-[6px]">
        {children}
      </div>
      {overlay}
    </div>
  );
}

function Paywall() {
  useEffect(() => track("ViewContent", { content_name: "Paywall: verdict" }), []);
  return (
    <>
      <p className="font-semibold text-ink-900">Bạn đã dùng hết {FREE_VERDICTS} lượt miễn phí</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-600">
        Một quyết định sai tốn hàng chục triệu. Mở khoá để xem kết luận không giới hạn cho mọi quyết định tiếp theo.
      </p>
      <Link
        href="/bang-gia"
        className="mt-4 block w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
      >
        Mở khoá từ 149.900đ
      </Link>
      <Link href="/kich-hoat" className="mt-2 block text-xs text-ink-500 underline underline-offset-2 hover:text-ink-900">
        Đã mua rồi? Nhập mã đơn để mở khoá
      </Link>
    </>
  );
}

function LeadPrompt({ tool, summary, onDone }: { tool: string; summary: string; onDone: () => void }) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async () => {
    setStatus("sending");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, tool, summary }),
    }).catch(() => null);
    if (!res?.ok) return setStatus("error");
    setStatus("sent");
    track("Lead", { content_name: "zalo" });
    setTimeout(onDone, 2500);
  };

  if (status === "sent") {
    return (
      <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-ink-800">
        Đã nhận. Chúng tôi sẽ nhắn bản tóm tắt qua Zalo cho bạn sớm.
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-4">
      <p className="text-sm font-semibold text-ink-900">Nhận bản tóm tắt kết luận này qua Zalo</p>
      <p className="mt-1 text-xs text-ink-600">Kèm gợi ý nên làm gì tiếp theo. Không spam, không bán số của bạn.</p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="Số Zalo của bạn"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          Gửi cho tôi
        </button>
      </form>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-red-600">{status === "error" ? "Số chưa đúng hoặc mạng lỗi, bạn thử lại nhé." : ""}</span>
        <button type="button" onClick={onDone} className="text-ink-400 hover:text-ink-700">
          Bỏ qua
        </button>
      </div>
    </div>
  );
}
