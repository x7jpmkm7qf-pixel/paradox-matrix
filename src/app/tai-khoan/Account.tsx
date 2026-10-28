"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { FounderGroupLink } from "@/components/pro/FounderGroupLink";
import { usePro } from "@/components/pro/ProProvider";
import { findAnyPlan } from "@/lib/plans";
import { FREE_VERDICTS } from "@/lib/trial";

export function Account() {
  const router = useRouter();
  const { isPro, plan, expiresAt, email, trial, signOut } = usePro();

  if (isPro === null) return <div className="h-64" />;
  if (!email) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
        <AuthPanel mode="login" next="/tai-khoan" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
      <h1 className="text-2xl font-semibold text-ink-900">Tài khoản của bạn</h1>
      <p className="mt-1 text-sm text-ink-600">{email}</p>

      <div className="mt-6 rounded-xl bg-ink-50 p-4 text-sm text-ink-700">
        {isPro ? (
          <p>
            Gói <b>{findAnyPlan(plan)?.name ?? plan}</b> ·{" "}
            {expiresAt ? `hết hạn ngày ${new Date(expiresAt).toLocaleDateString("vi-VN")}` : "trọn đời"}
          </p>
        ) : (
          <>
            <p>
              Gói <b>Miễn phí</b> · còn {trial?.left ?? FREE_VERDICTS}/{FREE_VERDICTS} lượt xem kết luận với số liệu riêng
            </p>
            <Link href="/bang-gia" className="mt-3 inline-block font-semibold text-accent-700 underline underline-offset-2">
              Nâng cấp Pro
            </Link>
          </>
        )}
      </div>
      <FounderGroupLink />

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/app" className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800">
          Vào công cụ
        </Link>
        <Link href="/kich-hoat" className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
          Nhập mã đơn
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm text-ink-600 hover:bg-ink-50"
        >
          Đăng xuất
        </button>
      </div>
      <p className="mt-6 text-xs text-ink-500">
        Đổi mật khẩu?{" "}
        <Link href="/quen-mat-khau" className="underline">
          Gửi đường dẫn đặt lại
        </Link>
        . Muốn xoá tài khoản, nhắn Zalo hỗ trợ ở cuối trang.
      </p>
    </div>
  );
}
