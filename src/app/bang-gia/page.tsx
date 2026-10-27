import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/site/PricingTable";

export const metadata: Metadata = { title: "Bảng giá · The Paradox Matrix" };

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Chọn gói phù hợp</h1>
          <p className="mt-3 text-sm text-ink-600">Dùng thử miễn phí cả 3 module. Nâng cấp Pro khi bạn muốn làm việc với số liệu thật.</p>
        </div>
        <PricingTable />
        <p className="mt-6 text-center text-xs text-ink-500">
          Cần xuất hóa đơn hoặc mua cho cả nhóm? Nhắn Zalo hỗ trợ ở cuối trang.
        </p>
      </main>
      <Footer />
    </>
  );
}
