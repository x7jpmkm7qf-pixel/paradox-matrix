import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { ResetPassword } from "./ResetPassword";

export const metadata: Metadata = { title: "Đặt mật khẩu mới · The Paradox Matrix", robots: { index: false } };

export default function Page() {
  if (!ACCOUNTS_ON) notFound();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
          <ResetPassword />
        </div>
      </main>
      <Footer />
    </>
  );
}
