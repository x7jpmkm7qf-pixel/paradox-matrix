import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/site/PricingTable";
import { founderOffer } from "@/lib/plans";
import { founderSeatsSold } from "@/lib/sepay";

export const metadata: Metadata = { title: "Bảng giá · The Paradox Matrix" };

// Re-read the founder seat count from SePay every 5 minutes.
export const revalidate = 300;

export default async function PricingPage() {
  const founder = founderOffer(await founderSeatsSold());
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Chọn gói phù hợp</h1>
          <p className="mt-3 text-sm text-ink-600">Dùng thử miễn phí cả 3 công cụ. Nâng cấp Pro khi bạn muốn làm việc với số liệu thật.</p>
        </div>
        <PricingTable founder={founder} />
        <p className="mt-6 text-center text-xs text-ink-500">
          Cần xuất hóa đơn hoặc mua cho cả nhóm? Nhắn Zalo hỗ trợ ở cuối trang.
        </p>
      </main>
      <Footer />
    </>
  );
}
