import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Activate } from "./Activate";

export const metadata: Metadata = { title: "Kích hoạt Pro · The Paradox Matrix", robots: { index: false } };

export default function ActivatePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <Activate />
      </main>
      <Footer />
    </>
  );
}
