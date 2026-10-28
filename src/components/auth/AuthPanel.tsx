"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MIN_PASSWORD } from "@/lib/accounts";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePro } from "@/components/pro/ProProvider";
import { track } from "@/lib/pixel";

/** Shown once Google is set up in Supabase (NEXT_PUBLIC_GOOGLE_LOGIN=1). */
const GOOGLE_ON = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "1";

/** Browsers built into Facebook, Messenger, Instagram, Zalo, TikTok… Google refuses to sign in there. */
const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Zalo|Line\/|TikTok|musical_ly|Bytedance|\bwv\)/i;

export type AuthMode = "signup" | "login" | "forgot";

type Step = AuthMode | "verify" | "forgot-sent";

interface AuthPanelProps {
  mode: AuthMode;
  /** Page to open once signed in; omit to stay on the current page (used inside the verdict overlay). */
  next?: string;
  /** Compact layout for the overlay. */
  compact?: boolean;
}

const input =
  "w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100";
const primary =
  "w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60";
const link = "text-ink-600 underline underline-offset-2 hover:text-ink-900";

function loginError(message: string, code?: string) {
  if (code === "email_not_confirmed" || /not confirmed/i.test(message)) return "unconfirmed";
  if (code === "invalid_credentials" || /invalid login/i.test(message)) return "Email hoặc mật khẩu chưa đúng.";
  return "Chưa đăng nhập được, bạn thử lại nhé.";
}

/** Sign-up, sign-in, email code and password reset in one card, so it works both as a page and inside an overlay. */
export function AuthPanel({ mode, next, compact }: AuthPanelProps) {
  const router = useRouter();
  const { refresh } = usePro();
  const [step, setStep] = useState<Step>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [otpType, setOtpType] = useState<"signup" | "magiclink">("signup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [inApp, setInApp] = useState<"ios" | "android" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (IN_APP.test(ua)) setInApp(/Android/i.test(ua) ? "android" : "ios");
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      window.prompt("Sao chép đường dẫn này rồi dán vào Safari hoặc Chrome:", window.location.href);
    }
  };

  // Google sign-in runs in a popup; it reports back here so the page (and any numbers typed on it) stays put.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "pm-auth") return;
      if (e.data.isNew) track("CompleteRegistration", { content_name: "google" });
      void finish();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });

  const google = async () => {
    setError(null);
    const target = next ?? window.location.pathname + window.location.search;
    const redirectTo = `${window.location.origin}/auth/callback?${new URLSearchParams({ next: target })}`;
    // Open the window inside the click so browsers do not block it, then point it at Google.
    const popup = window.open("", "pm-google", "width=480,height=640");
    const { data, error: err } = await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: "select_account" } },
    });
    if (err || !data?.url) {
      popup?.close();
      return setError("Chưa mở được đăng nhập Google, bạn thử lại hoặc dùng email nhé.");
    }
    if (popup) popup.location.href = data.url;
    else window.location.href = data.url;
  };

  const divider = (
    <div className="my-4 flex items-center gap-3 text-xs text-ink-400">
      <span className="h-px flex-1 bg-ink-200" />
      hoặc dùng email
      <span className="h-px flex-1 bg-ink-200" />
    </div>
  );

  const googleButton = !GOOGLE_ON ? null : inApp ? (
    <>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <p>
          Bạn đang mở trang trong ứng dụng (Facebook, Zalo…) nên Google không cho đăng nhập ở đây. Muốn dùng
          Google, hãy bấm <b>•••</b> ở góc trên rồi chọn <b>Mở bằng trình duyệt</b>
          {inApp === "ios" ? " (Safari)" : " (Chrome)"}.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {inApp === "android" && (
            <a
              href={`intent://${typeof window === "undefined" ? "" : window.location.host + window.location.pathname + window.location.search}#Intent;scheme=https;package=com.android.chrome;end`}
              className="rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Mở bằng Chrome
            </a>
          )}
          <button
            type="button"
            onClick={() => void copyLink()}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900"
          >
            {copied ? "Đã sao chép đường dẫn" : "Sao chép đường dẫn"}
          </button>
        </div>
      </div>
      {divider}
    </>
  ) : (
    <>
      <button
        type="button"
        onClick={() => void google()}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-ink-50"
      >
        <GoogleLogo />
        Tiếp tục với Google
      </button>
      {divider}
    </>
  );

  const go = (s: Step) => {
    setStep(s);
    setError(null);
    setNotice(null);
  };

  const finish = async () => {
    await refresh();
    if (next) {
      router.push(next);
      router.refresh();
    }
  };

  /** Creates the account (or re-sends the code to one never confirmed). */
  const sendCode = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, next: next ?? window.location.pathname }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { ok?: boolean; type?: "signup" | "magiclink"; error?: string; exists?: boolean } | null;
    if (!data?.ok) {
      if (data?.exists) go("login");
      setError(data?.error ?? "Mạng lỗi, bạn thử lại nhé.");
      return false;
    }
    setOtpType(data.type ?? "signup");
    return true;
  };

  const run = (fn: () => Promise<void>) => async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const signUp = run(async () => {
    if (await sendCode()) go("verify");
  });

  const verify = run(async () => {
    const { error: err } = await supabaseBrowser().auth.verifyOtp({ email, token: code.trim(), type: otpType });
    if (err) return setError("Mã chưa đúng hoặc đã hết hạn. Bạn kiểm tra lại, hoặc bấm gửi lại mã.");
    track("CompleteRegistration", { content_name: "account" });
    await finish();
  });

  const resend = run(async () => {
    if (await sendCode()) setNotice("Đã gửi mã mới. Bạn xem cả hộp thư Quảng cáo / Spam nhé.");
  });

  const logIn = run(async () => {
    const { error: err } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (!err) return finish();
    const msg = loginError(err.message, err.code);
    if (msg !== "unconfirmed") return setError(msg);
    // Signed up but never confirmed: send a fresh code straight away.
    if (await sendCode()) {
      go("verify");
      setNotice("Email này chưa được xác nhận. Chúng tôi vừa gửi mã mới cho bạn.");
    }
  });

  const forgot = run(async () => {
    const res = await fetch("/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!data?.ok) return setError(data?.error ?? "Mạng lỗi, bạn thử lại nhé.");
    go("forgot-sent");
  });

  const emailField = (
    <input
      type="email"
      required
      autoComplete="email"
      placeholder="Email của bạn"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className={input}
    />
  );

  let body: ReactNode;
  if (step === "signup") {
    body = (
      <Frame title="Tạo tài khoản miễn phí" sub="Kèm 3 lượt xem kết luận với số liệu của bạn." compact={compact}>
        {googleButton}
        <form onSubmit={signUp} className="space-y-3">
          {emailField}
          <input
            type="password"
            required
            minLength={MIN_PASSWORD}
            autoComplete="new-password"
            placeholder={`Mật khẩu (ít nhất ${MIN_PASSWORD} ký tự)`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
          <button type="submit" disabled={busy} className={primary}>
            {busy ? "Đang gửi mã..." : "Tạo tài khoản"}
          </button>
        </form>
        <p className="mt-3 text-xs text-ink-500">
          Bằng việc tạo tài khoản, bạn đồng ý với{" "}
          <Link href="/dieu-khoan" className={link}>
            điều khoản
          </Link>{" "}
          và{" "}
          <Link href="/chinh-sach-bao-mat" className={link}>
            chính sách bảo mật
          </Link>
          .
        </p>
        <p className="mt-3 text-sm text-ink-600">
          Đã có tài khoản?{" "}
          <button type="button" onClick={() => go("login")} className={link}>
            Đăng nhập
          </button>
        </p>
      </Frame>
    );
  } else if (step === "login") {
    body = (
      <Frame title="Đăng nhập" compact={compact}>
        {googleButton}
        <form onSubmit={logIn} className="space-y-3">
          {emailField}
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
          <button type="submit" disabled={busy} className={primary}>
            {busy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-ink-600">
          <button type="button" onClick={() => go("forgot")} className={link}>
            Quên mật khẩu?
          </button>
          <span>
            Chưa có tài khoản?{" "}
            <button type="button" onClick={() => go("signup")} className={link}>
              Tạo miễn phí
            </button>
          </span>
        </div>
      </Frame>
    );
  } else if (step === "verify") {
    body = (
      <Frame title="Kiểm tra email của bạn" sub={`Chúng tôi vừa gửi mã xác nhận tới ${email}. Nhập mã vào đây, hoặc bấm nút trong email.`} compact={compact}>
        <form onSubmit={verify} className="space-y-3">
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            pattern="[0-9]{6,10}"
            placeholder="Mã xác nhận"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className={`${input} text-center font-mono text-lg tracking-[0.4em]`}
          />
          <button type="submit" disabled={busy} className={primary}>
            {busy ? "Đang kiểm tra..." : "Xác nhận"}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-ink-600">
          <button type="button" onClick={() => void resend()} disabled={busy} className={link}>
            Gửi lại mã
          </button>
          <button type="button" onClick={() => go("signup")} className={link}>
            Đổi email
          </button>
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
          Không thấy email sau 1 phút? Mở mục <b>Thư rác (Spam)</b> hoặc Quảng cáo trong hộp thư.
        </p>
      </Frame>
    );
  } else if (step === "forgot") {
    body = (
      <Frame title="Quên mật khẩu" sub="Nhập email đã đăng ký, chúng tôi gửi đường dẫn đặt mật khẩu mới." compact={compact}>
        <form onSubmit={forgot} className="space-y-3">
          {emailField}
          <button type="submit" disabled={busy} className={primary}>
            {busy ? "Đang gửi..." : "Gửi đường dẫn"}
          </button>
        </form>
        <p className="mt-3 text-sm text-ink-600">
          <button type="button" onClick={() => go("login")} className={link}>
            Quay lại đăng nhập
          </button>
        </p>
      </Frame>
    );
  } else {
    body = (
      <Frame
        title="Đã gửi email"
        sub={`Nếu ${email} đã có tài khoản, bạn sẽ nhận được đường dẫn đặt lại mật khẩu trong vài phút. Xem cả mục Quảng cáo / Spam.`}
        compact={compact}
      >
        <button type="button" onClick={() => go("login")} className={primary}>
          Quay lại đăng nhập
        </button>
      </Frame>
    );
  }

  return (
    <div>
      {body}
      {notice && <p className="mt-3 text-sm text-emerald-700">{notice}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function Frame({ title, sub, compact, children }: { title: string; sub?: string; compact?: boolean; children: ReactNode }) {
  return (
    <>
      <h1 className={compact ? "font-semibold text-ink-900" : "text-2xl font-semibold text-ink-900"}>{title}</h1>
      {sub && <p className={`mt-1 ${compact ? "text-xs" : "text-sm"} leading-relaxed text-ink-600`}>{sub}</p>}
      <div className={compact ? "mt-4" : "mt-6"}>{children}</div>
    </>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
