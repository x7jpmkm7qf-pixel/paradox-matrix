import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Engine } from "./Engine";
import { TRACKS } from "./content";

export const metadata: Metadata = {
  title: "Động cơ Nghịch lý Chiến lược · The Paradox Matrix",
  description:
    "6 nghịch lý toán học biến thành bài học kinh doanh dùng được ngay: cho tiểu thương và người làm một mình, cho quản lý đội ngũ, và cho lãnh đạo chiến lược.",
};

export default function EnginePage() {
  return (
    <>
      <Header />
      <main>
        <section className="pm-grid relative overflow-hidden bg-night-950 text-white">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
            <p className="font-mono text-xs text-flame-400">Business &amp; Life Paradox Engine</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Động cơ Nghịch lý Chiến lược: 6 điều nghe vô lý nhưng đúng, và cách biến chúng thành tiền.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Mỗi nghịch lý là một chỗ trực giác của người giỏi vẫn trượt. Chọn đúng tầng của bạn, đoán thử, tự tay chạy con số, rồi mang về
              một danh sách việc làm được ngay sáng mai.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {TRACKS.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="pm-glass group rounded-2xl p-4 transition hover:border-flame-400/60">
                  <p className="font-mono text-xs text-flame-400">{t.tag}</p>
                  <p className="mt-1 font-semibold">{t.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{t.audience.join(" · ")}</p>
                  <p className="mt-3 text-xs font-semibold text-white/80 group-hover:text-white">Vào tầng này →</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Engine />

        <section className="border-t border-ink-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <p className="text-2xl font-semibold tracking-tight text-ink-900">Hiểu bẫy rồi, giờ soi chính con số của bạn.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              3 công cụ của The Paradox Matrix nhận số liệu thật của bạn và trả lời bằng một câu: nên làm gì, nên dừng gì.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/app" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
                Dùng thử miễn phí
              </Link>
              <Link
                href="/bang-gia"
                className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
