"use client";

import Link from "next/link";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { usePro } from "@/components/pro/ProProvider";

/** "Đăng nhập" or "Tài khoản" in the header, once accounts are configured. */
export function AccountLink() {
  const { isPro, email } = usePro();
  if (!ACCOUNTS_ON || isPro === null) return null;
  return (
    <Link
      href={email ? "/tai-khoan" : "/dang-nhap"}
      className="rounded-lg px-2.5 py-1.5 text-ink-300 hover:bg-white/10 hover:text-white"
    >
      {email ? "Tài khoản" : "Đăng nhập"}
    </Link>
  );
}
