import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "Thanh toán · The Paradox Matrix", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Suspense>
          <Checkout />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
