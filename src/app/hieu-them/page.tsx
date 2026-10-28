import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HowItComputes } from "./HowItComputes";

export const metadata: Metadata = {
  title: "Hiểu thêm về 3 cái bẫy · The Paradox Matrix",
  description:
    "Tiếc tiền đã chi, báo cáo đánh lừa, bỏ cuộc quá sớm: vì sao người giỏi nghề vẫn mắc, dấu hiệu nhận biết, và cách The Paradox Matrix giúp bạn thoát ra.",
};

const TRAPS = [
  {
    id: "tiec-tien",
    tag: "Bẫy 01",
    name: "Tiếc tiền đã chi",
    oneLine: "Chạy tiếp một việc đang lỗ, chỉ vì đã lỡ bỏ vào quá nhiều.",
    looksLike: [
      "“Đã đổ 50 triệu rồi, giờ dừng thì phí.”",
      "Bơm thêm ngân sách cho một chiến dịch vì “nó từng ra đơn”.",
      "Giữ một cửa hàng, một nhân sự, một sản phẩm vì đã đầu tư quá nhiều công sức.",
    ],
    why: "Mất tiền làm ta đau gấp đôi so với niềm vui khi được số tiền tương đương. Dừng lại nghĩa là thừa nhận khoản đã chi là mất, nên não tìm mọi lý do để đi tiếp. Người càng có trách nhiệm, càng ghét bỏ dở, lại càng dễ mắc.",
    example:
      "Bạn đã chi 500 triệu cho một dự án. Cần thêm 300 triệu nữa để làm xong. Lúc mới bắt đầu, cơ hội có lãi là 40%. Sau 3 tháng, số liệu thật cho thấy chỉ còn 12%. Nếu hôm nay mới bắt đầu, bạn có bỏ 300 triệu vào một việc chỉ có 12% cơ hội không? Hầu hết sẽ nói không. Nhưng vì đã có 500 triệu nằm đó, phần lớn vẫn chạy tiếp.",
    check: "Nếu hôm nay mới bắt đầu, với những gì tôi biết bây giờ, tôi có bỏ tiền vào việc này không?",
    tool: "Công cụ 01 tính lại cơ hội thành công mỗi khi có số liệu mới, rồi so hai đường: chạy tiếp và dừng lại làm việc khác. Nếu lý do duy nhất để chạy tiếp là tiếc tiền, nó bật cảnh báo đỏ và cho bạn biết dừng lại tốt hơn bao nhiêu tiền.",
    href: "/app#bayes",
  },
  {
    id: "bao-cao",
    tag: "Bẫy 02",
    name: "Báo cáo đánh lừa",
    oneLine: "Con số tổng nói A giỏi hơn B, nhưng tách nhỏ ra thì B thắng ở mọi nhóm.",
    looksLike: [
      "Thưởng nhân viên có tỷ lệ chốt đơn tổng cao nhất.",
      "Cắt kênh quảng cáo có chi phí trung bình cao hơn.",
      "Kết luận “sản phẩm mới bán kém hơn” chỉ nhìn doanh thu tổng.",
    ],
    why: "Con số tổng trộn lẫn nhiều nhóm khách khác nhau. Nếu A được giao toàn khách dễ, còn B nhận toàn khách khó, A sẽ trông giỏi hơn dù thực ra kém hơn ở từng nhóm. Con số tổng không sai, nó chỉ đang trả lời một câu hỏi khác với câu bạn đang hỏi.",
    example:
      "Chi nhánh A chốt 83% khách, chi nhánh B chốt 78%. Tách ra: với khách lẻ, B chốt 93% còn A 87%. Với khách sỉ, B chốt 73% còn A 69%. B thắng ở cả hai nhóm. A trông giỏi chỉ vì có nhiều khách lẻ, nhóm vốn dễ chốt.",
    check: "Hai bên tôi đang so có được giao cùng một kiểu khách, cùng một điều kiện không?",
    tool: "Công cụ 02 tự tách số liệu theo từng nhóm khách, kênh hoặc khu vực, so sòng phẳng hai bên, rồi chỉ ra nhóm nào đang làm lệch con số tổng. Bạn có thể dán thẳng bảng từ Excel hoặc Google Sheets.",
    href: "/app#simpson",
  },
  {
    id: "bo-cuoc",
    tag: "Bẫy 03",
    name: "Bỏ cuộc quá sớm",
    oneLine: "Mong kết quả tăng đều theo công sức, nên bỏ đúng lúc sắp bật lên.",
    looksLike: [
      "“Làm TikTok 2 tháng không lên, chắc không hợp.”",
      "Đổi hướng liên tục vì mỗi hướng chưa thấy kết quả sau vài tuần.",
      "Dừng một sản phẩm mới trước khi khách quen kịp quay lại mua lần hai.",
    ],
    why: "Ta quen nghĩ theo kiểu đều đều: làm gấp đôi thì được gấp đôi. Nhưng kênh nội dung, thương hiệu, tệp khách quen lại tăng kiểu dồn: lì rất lâu ở đầu, rồi bật rất nhanh về sau. Ở đoạn đầu, kết quả thật luôn thấp hơn mức ta mong, nên cảm giác “không hiệu quả” là có thật, chỉ là nó đang nói sai.",
    example:
      "Kênh có 100 người theo dõi, tăng đều 8% mỗi tuần. Đến tuần 21 mới có khoảng 500 người, thấp hơn mức bạn mong (730). Đa số bỏ ở đây. Nhưng tới tuần 30, kênh vượt mức mong đợi, và cuối năm đạt khoảng 5.500 người, gấp hơn 10 lần lúc định bỏ.",
    check: "Kết quả của tôi đang đứng im, hay đang tăng đều nhưng còn nhỏ?",
    tool: "Công cụ 03 vẽ đường tăng trưởng thật của bạn cạnh mức bạn đang mong, chỉ ra điểm bùng phát rơi vào tuần nào, và cho biết nếu bỏ ở tuần bạn định bỏ thì bạn đang để lại bao nhiêu.",
    href: "/app#exponential",
  },
];

export default function LearnMorePage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <p className="font-mono text-xs text-accent-600">Hiểu thêm</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            3 cái bẫy khiến người giỏi nghề vẫn mất tiền, và cách nhận ra chúng.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Đọc trang này trong 5 phút, bạn sẽ biết mỗi bẫy trông như thế nào ngoài đời, vì sao não mình dễ mắc, một câu hỏi để tự kiểm tra,
            và công cụ nào trên nền tảng The Paradox Matrix giúp bạn thoát ra.
          </p>
          <nav className="mt-8 flex flex-wrap gap-2 text-sm">
            {TRAPS.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="rounded-full border border-ink-200 bg-white px-4 py-1.5 text-ink-700 hover:border-ink-900"
              >
                {t.tag} · {t.name}
              </a>
            ))}
          </nav>
        </section>

        <section className="border-y border-ink-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Vì sao tên là “The Paradox Matrix”?</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                <b>Paradox</b> nghĩa là nghịch lý: điều nghe rất đúng nhưng thực ra sai. Cả 3 bẫy đều như vậy, đó là lý do chúng nguy hiểm.
                <b> Matrix</b> là tấm bảng soi một quyết định từ nhiều góc cùng lúc: tiền đã chi và tiền sắp chi, con số tổng và từng nhóm
                nhỏ, hôm nay và vài tháng tới.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Đằng sau là toán, nhưng bạn không phải tính.</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Mỗi công cụ dựa trên những phép tính xác suất và thống kê mà ngân hàng, bác sĩ, nhà khoa học đã dùng hàng trăm năm. Chúng
                tôi giấu hết công thức đi. Bạn chỉ nhập con số mình đã có, máy tính xong và trả lời bằng một câu tiếng Việt: nên làm gì, nên
                dừng gì.
              </p>
              <a href="#ben-trong" className="mt-3 inline-block text-sm font-semibold text-ink-900 underline underline-offset-2">
                Xem máy tính từng bước thế nào →
              </a>
            </div>
          </div>
        </section>

        <HowItComputes />

        {TRAPS.map((t, i) => (
          <section key={t.id} id={t.id} className={`scroll-mt-20 ${i % 2 ? "bg-ink-50" : ""}`}>
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
              <p className="font-mono text-xs text-accent-600">{t.tag}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">{t.name}</h2>
              <p className="mt-2 text-lg text-ink-700">{t.oneLine}</p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-ink-200 bg-white p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Ngoài đời nó trông thế này</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
                    {t.looksLike.map((l) => (
                      <li key={l} className="flex gap-2">
                        <span className="text-red-500">•</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-ink-200 bg-white p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Vì sao người giỏi vẫn mắc</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{t.why}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Ví dụ bằng con số</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t.example}</p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.4fr]">
                <div className="rounded-2xl bg-ink-900 p-6 text-white">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-300">Câu hỏi tự kiểm tra</h3>
                  <p className="mt-3 text-lg font-semibold leading-snug">{t.check}</p>
                </div>
                <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-700">The Paradox Matrix giúp bạn thế nào</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{t.tool}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                    <Link href={t.href} className="text-ink-900 underline underline-offset-2">
                      Thử với số liệu của bạn →
                    </Link>
                    <a href={`#may-0${i + 1}`} className="text-accent-700 underline underline-offset-2">
                      Xem cách máy tính
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-ink-200">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <p className="text-2xl font-semibold tracking-tight text-ink-900">Bạn đang mắc bẫy nào? 5 câu hỏi, 2 phút là biết.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/#kiem-tra" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
                Làm bài kiểm tra miễn phí
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
