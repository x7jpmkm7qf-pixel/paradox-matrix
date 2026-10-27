import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { founderOffer, plansFor } from "@/lib/plans";
import { founderSeatsSold } from "@/lib/sepay";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "Thanh toán · The Paradox Matrix", robots: { index: false } };

// Re-read the founder seat count from SePay every 5 minutes.
export const revalidate = 300;

export default async function CheckoutPage() {
  const founder = founderOffer(await founderSeatsSold());
  const plans = plansFor(founder).filter((p) => !(p.id === "founder" && founder.soldOut));
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Suspense>
          <Checkout plans={plans} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
