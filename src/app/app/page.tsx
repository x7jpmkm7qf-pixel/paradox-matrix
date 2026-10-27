import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Dashboard } from "@/components/layout/Dashboard";

export const metadata: Metadata = { title: "Dashboard · The Paradox Matrix" };

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <Dashboard />
      </main>
      <Footer />
    </>
  );
}
