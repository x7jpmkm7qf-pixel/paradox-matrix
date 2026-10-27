import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/site/PricingTable";

const TRAPS = [
  {
    tag: "Module 01 · Bayes & Monty Hall",
    title: "Đổ thêm tiền vì đã lỡ đổ quá nhiều",
    body: "Chiến dịch quảng cáo lỗ 3 tháng, bạn vẫn chạy tiếp “vì đã đầu tư 50 triệu rồi”. Engine Bayes cập nhật xác suất thành công từ dữ liệu thật và cảnh báo khi bạn đang đi tiếp chỉ vì tiếc chi phí chìm.",
  },
  {
    tag: "Module 02 · Nghịch lý Simpson",
    title: "Đọc báo cáo tổng mà kết luận ngược",
    body: "Chi nhánh A có tỷ lệ chốt đơn tổng cao hơn B, nhưng ở từng nhóm khách B lại thắng. Công cụ bóc tách dữ liệu theo phân khúc và chỉ ra khi con số tổng đang nói dối bạn.",
  },
  {
    tag: "Module 03 · Tăng trưởng hàm mũ",
    title: "Bỏ cuộc ngay trước điểm bùng phát",
    body: "Đăng nội dung 2 tháng không thấy kết quả nên dừng. Mô phỏng tăng trưởng hàm mũ cho bạn thấy giai đoạn “phẳng” dài bao lâu và điểm bùng phát nằm ở đâu, để không dừng sai thời điểm.",
  },
];

const FAQ = [
  {
    q: "Tôi không giỏi toán, có dùng được không?",
    a: "Được. Bạn chỉ nhập con số kinh doanh quen thuộc (chi phí, số đơn, tỷ lệ chốt). Công cụ tự tính và giải thích kết quả bằng tiếng Việt dễ hiểu.",
  },
  {
    q: "Số liệu kinh doanh của tôi có bị gửi lên mạng không?",
    a: "Không. Mọi tính toán chạy ngay trên trình duyệt của bạn. Chúng tôi không lưu và không nhìn thấy số liệu bạn nhập.",
  },
  {
    q: "Thanh toán thế nào, bao lâu thì dùng được Pro?",
    a: "Bạn quét mã QR bằng app ngân hàng bất kỳ. Hệ thống tự nhận tiền và mở khóa Pro trong vài giây, không cần chờ duyệt tay.",
  },
  {
    q: "Dùng Pro trên máy khác được không?",
    a: "Được. Sau khi thanh toán, bạn nhận một mã kích hoạt. Nhập mã đó ở trang Kích hoạt trên máy khác là xong.",
  },
  {
    q: "Không hài lòng thì sao?",
    a: "Trong 7 ngày đầu, nếu Pro không giúp được gì cho bạn, nhắn Zalo hỗ trợ để được hoàn tiền 100%.",
  },
];

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <p className="inline-block rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
            Công cụ tư duy xác suất cho chủ doanh nghiệp &amp; solopreneur
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Trực giác của bạn đang làm bạn mất tiền ở 3 chỗ này.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Tin nhầm tín hiệu, đọc sai số liệu tổng hợp, và bỏ cuộc ngay trước điểm bùng phát. The Paradox Matrix biến 3 nghịch lý
            toán học đó thành công cụ bạn thử được với số liệu của chính mình, trong 5 phút.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/app" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              Dùng thử miễn phí
            </Link>
            <Link href="#bang-gia" className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50">
              Xem bảng giá
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-500">Không cần đăng ký · Số liệu không rời khỏi máy bạn</p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {TRAPS.map((t) => (
              <article key={t.title} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <p className="font-mono text-xs text-accent-600">{t.tag}</p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{t.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-ink-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
            {[
              ["1", "Chọn bài toán", "Một quyết định đang phân vân, một báo cáo nghi ngờ, hay một kênh đang “phẳng”."],
              ["2", "Nhập số liệu thật", "Gõ tay hoặc dán CSV từ Excel, Google Sheets, phần mềm bán hàng."],
              ["3", "Đọc kết luận", "Biểu đồ và cảnh báo bằng tiếng Việt, xuất PDF để bàn với đối tác."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">{n}</span>
                <h3 className="mt-3 font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="bang-gia" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">Bảng giá</h2>
            <p className="mt-2 text-sm text-ink-600">Rẻ hơn một bữa cà phê mỗi tuần, cho những quyết định đáng giá hàng chục triệu.</p>
          </div>
          <PricingTable />
          <p className="mt-6 text-center text-xs text-ink-500">Thanh toán QR ngân hàng · Kích hoạt tự động · Hoàn tiền 100% trong 7 ngày</p>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900">Câu hỏi thường gặp</h2>
          <div className="mt-8 divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-white">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none font-medium text-ink-900">
                  {f.q}
                  <span className="float-right text-ink-400 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/app" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              Thử ngay với số liệu của bạn
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
