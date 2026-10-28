"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MIN_PASSWORD } from "@/lib/accounts";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePro } from "@/components/pro/ProProvider";
import { track } from "@/lib/pixel";

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
        <p className="mt-3 text-xs text-ink-500">Không thấy email? Xem trong mục Quảng cáo hoặc Spam.</p>
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
