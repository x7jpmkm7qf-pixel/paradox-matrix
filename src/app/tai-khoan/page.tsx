import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { Account } from "./Account";

export const metadata: Metadata = { title: "Tài khoản · The Paradox Matrix", robots: { index: false } };

export default function Page() {
  if (!ACCOUNTS_ON) notFound();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
        <Account />
      </main>
      <Footer />
    </>
  );
}
