import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/layout/Dashboard";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <section className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Ra quyết định tốt hơn trực giác của bạn.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-600">
            Ba nghịch lý toán học khiến chủ doanh nghiệp mất tiền nhiều nhất: tin nhầm tín hiệu, đọc sai số liệu tổng hợp và bỏ cuộc
            ngay trước điểm bùng phát. The Paradox Matrix biến chúng thành công cụ bạn có thể thử với con số của chính mình.
          </p>
        </section>
        <Dashboard />
      </main>
      <footer className="border-t border-ink-200 py-6 text-center text-xs text-ink-400">
        The Paradox Matrix · Mọi tính toán chạy ngay trên trình duyệt, không gửi dữ liệu đi đâu.
      </footer>
    </>
  );
}
