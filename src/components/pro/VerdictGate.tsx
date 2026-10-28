"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePro } from "./ProProvider";
import { track } from "@/lib/pixel";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { FREE_VERDICTS } from "@/lib/trial";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { IMPACT_EVENT, readTotals, recordImpact, vndWords, type Impact, type ImpactTotals } from "@/lib/impact";
import { PLANS } from "@/lib/plans";

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
  /** What following this verdict is worth; null when there is nothing to flag. */
  impact?: Impact | null;
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
export function VerdictGate({ tool, fingerprint, isSample, summary, impact = null, children }: VerdictGateProps) {
  const { isPro } = usePro();
  const gate = useGate(tool, fingerprint);
  const [busy, setBusy] = useState(false);
  const revealed = Boolean(isPro || isSample || gate.unlockedHere);

  useEffect(() => {
    if (revealed && !isSample && impact) recordImpact(tool, fingerprint, impact);
  }, [revealed, isSample, impact, tool, fingerprint]);

  if (isPro || isSample) {
    return (
      <>
        {impact && <ImpactBanner impact={impact} sample={isSample} />}
        {children}
      </>
    );
  }
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
        {impact && <ImpactBanner impact={impact} />}
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
      tall={left === 0}
      overlay={
        <Overlay>
          {left > 0 ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-600">Kết luận đã sẵn sàng</p>
              {impact ? (
                <p className="mt-2 text-lg font-semibold leading-snug tracking-tight text-ink-900">{impact.teaser}</p>
              ) : (
                <p className="mt-2 text-lg font-semibold leading-snug tracking-tight text-ink-900">Xem nên làm gì với số liệu của bạn</p>
              )}
              <button
                type="button"
                onClick={unlock}
                disabled={busy}
                className="mt-4 w-full rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-ink-800 disabled:opacity-60"
              >
                Xem kết luận →
              </button>
              <p className="mt-2 text-xs text-ink-500">
                Còn {left}/{FREE_VERDICTS} lượt miễn phí. Mỗi bộ số mới tính 1 lượt.
              </p>
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
    <div className={`relative ${tall ? "min-h-[36rem]" : "min-h-56"}`}>
      <div aria-hidden className="pointer-events-none select-none blur-[6px]">
        {children}
      </div>
      {overlay}
    </div>
  );
}

/** Running total of what revealed verdicts were worth, kept in this browser. */
function useImpactTotals(): ImpactTotals {
  const [totals, setTotals] = useState<ImpactTotals>({ vnd: 0, count: 0 });
  useEffect(() => {
    const refresh = () => setTotals(readTotals());
    refresh();
    window.addEventListener(IMPACT_EVENT, refresh);
    return () => window.removeEventListener(IMPACT_EVENT, refresh);
  }, []);
  return totals;
}

function ImpactBanner({ impact, sample }: { impact: Impact; sample?: boolean }) {
  const totals = useImpactTotals();
  const showTotal = !sample && totals.count > 1;
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
        {sample ? "Ví dụ với số mẫu" : "Giá trị của kết luận này"}
      </p>
      {impact.vnd ? (
        <>
          <p className="mt-2 text-sm text-emerald-50">Làm theo kết luận này, bạn hơn</p>
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{vndWords(impact.vnd)}</p>
          <p className="mt-1 text-sm text-emerald-50">so với chọn ngược lại.</p>
        </>
      ) : (
        <p className="mt-2 text-lg font-semibold leading-snug">{impact.headline}</p>
      )}
      {showTotal && (
        <p className="mt-4 border-t border-white/20 pt-3 text-xs text-emerald-50">
          Cộng dồn {totals.count} lần kiểm tra:{" "}
          <b className="text-white">{totals.vnd > 0 ? `${vndWords(totals.vnd)} giữ lại` : `${totals.count} cái bẫy đã tránh`}</b>
        </p>
      )}
    </div>
  );
}

const SIX_MONTHS = PLANS.find((p) => p.id === "pro-6m")!;

function Paywall() {
  useEffect(() => track("ViewContent", { content_name: "Paywall: verdict" }), []);
  const totals = useImpactTotals();
  const share = totals.vnd > 0 ? (SIX_MONTHS.price / totals.vnd) * 100 : null;
  const shareText = share === null || share > 50 ? null : share < 0.1 ? "chưa tới 0,1%" : `${share.toFixed(1).replace(".", ",")}%`;

  return (
    <div className="-m-5 rounded-2xl bg-ink-900 p-6 text-left text-white">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Đã dùng hết {FREE_VERDICTS} lượt miễn phí</p>
      {totals.vnd > 0 ? (
        <>
          <p className="mt-3 text-sm text-ink-300">{totals.count} lần kiểm tra vừa giữ lại cho bạn</p>
          <p className="text-4xl font-semibold tracking-tight text-emerald-400">{vndWords(totals.vnd)}</p>
        </>
      ) : totals.count > 0 ? (
        <p className="mt-3 text-2xl font-semibold leading-tight">Bạn vừa tránh {totals.count} cái bẫy mất tiền.</p>
      ) : (
        <p className="mt-3 text-2xl font-semibold leading-tight">Một quyết định sai tốn hàng chục triệu.</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-ink-200">
        Pro 6 tháng chỉ {SIX_MONTHS.price.toLocaleString("vi-VN")}đ
        {shareText ? (
          <>
            , bằng <b className="text-white">{shareText}</b> con số đó
          </>
        ) : null}
        . Quyết định tiếp theo, bạn định làm theo cảm giác?
      </p>
      <Link
        href="/bang-gia"
        className="mt-5 block w-full rounded-xl bg-amber-400 px-4 py-3 text-center text-sm font-bold text-ink-900 shadow-lg shadow-amber-500/20 transition hover:-translate-y-px hover:bg-amber-300"
      >
        Mở khoá không giới hạn →
      </Link>
      <ul className="mt-4 space-y-1 text-xs text-ink-300">
        <li>✓ Hoàn tiền 100% trong 7 ngày nếu thấy không đáng</li>
        <li>✓ Chuyển khoản QR, mở khoá ngay sau vài giây</li>
      </ul>
      <Link href="/kich-hoat" className="mt-4 block text-center text-xs text-ink-400 underline underline-offset-2 hover:text-white">
        Đã mua rồi? Nhập mã đơn để mở khoá
      </Link>
    </div>
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
