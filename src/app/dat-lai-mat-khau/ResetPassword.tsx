"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MIN_PASSWORD } from "@/lib/accounts";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePro } from "@/components/pro/ProProvider";

/** Reached from the reset email, which has already signed the visitor in. */
export function ResetPassword() {
  const router = useRouter();
  const { email } = usePro();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const { error: err } = await supabaseBrowser().auth.updateUser({ password });
    setBusy(false);
    if (err) {
      return setError(
        /session/i.test(err.message)
          ? "Đường dẫn đã hết hạn. Bạn yêu cầu gửi lại ở trang Quên mật khẩu nhé."
          : /different/i.test(err.message)
            ? "Mật khẩu mới cần khác mật khẩu cũ."
            : "Chưa đổi được mật khẩu, bạn thử lại nhé.",
      );
    }
    router.push("/app?chao=1");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink-900">Đặt mật khẩu mới</h1>
      {email && <p className="mt-1 text-sm text-ink-600">Cho tài khoản {email}</p>}
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <input
          type="password"
          required
          minLength={MIN_PASSWORD}
          autoComplete="new-password"
          placeholder={`Mật khẩu mới (ít nhất ${MIN_PASSWORD} ký tự)`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
        >
          {busy ? "Đang lưu..." : "Lưu mật khẩu"}
        </button>
      </form>
      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}{" "}
          <Link href="/quen-mat-khau" className="underline">
            Gửi lại
          </Link>
        </p>
      )}
    </>
  );
}
