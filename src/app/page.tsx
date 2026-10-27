import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/site/PricingTable";
import { Quiz } from "@/components/site/Quiz";
import { FOUNDER_SEATS, founderOffer, vnd } from "@/lib/plans";
import { founderSeatsSold } from "@/lib/sepay";

const PROOF = [
  ["50 triệu", "tiền quảng cáo đổ vào một chiến dịch “tiếc không nỡ tắt”"],
  ["78% → 69%", "con số tổng nói A giỏi hơn, nhưng B thắng ở mọi nhóm khách"],
  ["Tuần thứ 9", "lúc phần lớn người làm nội dung bỏ cuộc, ngay trước khi kết quả bật lên"],
];

const TRAPS = [
  {
    tag: "Bẫy 01 · Doanh thu ảo",
    title: "“Báo cáo nói kênh này tốt. Bạn dồn tiền vào. Rồi lỗ.”",
    body: "Nhìn tổng, chi nhánh A chốt đơn 78%, B chỉ 69%. Bạn thưởng A, cắt ngân sách B. Nhưng tách ra từng nhóm khách thì B thắng ở mọi nhóm. A trông đẹp chỉ vì được giao toàn khách dễ. Con số tổng không sai, nó chỉ đang giấu sự thật.",
  },
  {
    tag: "Bẫy 02 · Tiếc tiền đã chi",
    title: "“Đã lỡ đổ 50 triệu rồi, giờ dừng thì phí.”",
    body: "Số tiền đã chi không quay lại, dù bạn chạy tiếp hay dừng. Câu duy nhất đáng hỏi: từ hôm nay, mỗi đồng bỏ thêm còn bao nhiêu cơ hội sinh lời? Lúc đầu là 40%. Sau 3 tháng số liệu thật còn 12%. Nhưng bạn vẫn chạy, vì cảm giác không chịu cập nhật.",
  },
  {
    tag: "Bẫy 03 · Mong kết quả đi thẳng",
    title: "“Làm 2 tháng không thấy gì, chắc không hợp với mình.”",
    body: "Nội dung, thương hiệu, tệp khách quen tăng theo kiểu lì rất lâu rồi bật lên rất nhanh. Phần lớn người bỏ cuộc đúng ở đoạn phẳng nhất, khi chỉ còn vài tuần nữa là tới điểm bật. Người đến sau nhặt lại đúng thứ bạn vừa bỏ.",
  },
];

const TOOLS = [
  {
    n: "①",
    name: "Máy đo “có nên chi tiếp?”",
    body: "Nhập số đã chi và kết quả từng tuần. Công cụ cập nhật cơ hội thắng thật sự sau mỗi đợt số liệu mới, và bật cảnh báo đỏ khi lý do duy nhất để chạy tiếp là tiếc tiền.",
    when: "Phân vân có nên bơm thêm tiền quảng cáo, tuyển thêm người, mở thêm điểm bán.",
    href: "/app#bayes",
  },
  {
    n: "②",
    name: "Máy soi báo cáo",
    body: "Dán bảng số liệu từ Excel hay Google Sheets. Công cụ tự tách theo nhóm khách, kênh, khu vực, rồi chỉ ra chỗ con số tổng đang nói ngược với thực tế.",
    when: "Sắp thưởng, cắt ngân sách hay chọn kênh dựa trên báo cáo tổng.",
    href: "/app#simpson",
  },
  {
    n: "③",
    name: "Máy dự báo “bao giờ bật lên?”",
    body: "Nhập tốc độ tăng hiện tại. Công cụ vẽ ra đoạn phẳng còn kéo dài bao lâu và điểm bật nằm ở đâu, để bạn quyết dừng hay trụ bằng con số, không bằng cảm xúc.",
    when: "Muốn bỏ một kênh nội dung, một sản phẩm mới, một thị trường mới.",
    href: "/app#exponential",
  },
];

const CASES = [
  {
    who: "Chủ shop mỹ phẩm online · quảng cáo 40 triệu/tháng",
    story:
      "Chiến dịch “bán chạy nhất năm ngoái” lỗ 3 tháng liền. Chị định tăng ngân sách vì “nó từng ra đơn”. Máy đo cho thấy cơ hội có lãi đã tụt từ 45% xuống 9%. Chị tắt chiến dịch, dồn tiền sang nhóm sản phẩm mới.",
    result: "Giữ lại khoảng 120 triệu trong 3 tháng sau.",
  },
  {
    who: "Quản lý chuỗi 2 chi nhánh",
    story:
      "Báo cáo tổng: chi nhánh A chốt 78%, B chỉ 69%. Anh định chuyển trưởng nhóm giỏi nhất của B sang A. Tách theo khách lẻ và khách sỉ: B thắng ở cả hai nhóm, A chỉ được giao nhiều khách lẻ dễ chốt.",
    result: "Giữ nguyên đội B, đổi cách chia khách. Không mất người giỏi.",
  },
  {
    who: "Người làm nội dung một mình",
    story:
      "Sau 9 tuần đăng TikTok, lượt theo dõi gần như đứng im. Máy dự báo cho thấy tốc độ tăng vẫn đều 8% mỗi tuần, điểm bật rơi vào khoảng tuần 14.",
    result: "Trụ thêm 6 tuần, kênh vượt 10.000 người theo dõi.",
  },
];

const FAQ = [
  {
    q: "Tôi dốt toán, có dùng được không?",
    a: "Được. Bạn không cần tính gì. Biết số đơn, số tiền là đủ. Công cụ tự tính và nói kết luận bằng tiếng Việt dễ hiểu.",
  },
  {
    q: "Số liệu kinh doanh của tôi có bị gửi lên mạng không?",
    a: "Không. Mọi phép tính chạy ngay trên trình duyệt của bạn. Chúng tôi không lưu và không nhìn thấy số liệu bạn nhập.",
  },
  {
    q: "Tôi có kế toán rồi, cần gì cái này?",
    a: "Kế toán ghi lại chuyện đã xảy ra. Công cụ này giúp bạn quyết định chuyện sắp xảy ra.",
  },
  {
    q: "Thanh toán thế nào, bao lâu thì dùng được Pro?",
    a: "Bạn quét mã QR bằng app ngân hàng bất kỳ. Hệ thống tự nhận tiền và mở khóa Pro trong vài giây, không cần chờ duyệt.",
  },
  {
    q: "Không hài lòng thì sao?",
    a: "Trong 7 ngày, nếu công cụ không chỉ ra được ít nhất một chỗ bạn đang quyết định sai, nhắn Zalo hỗ trợ để được hoàn tiền 100%. Không hỏi lý do.",
  },
];

// Re-read the founder seat count from SePay every 5 minutes.
export const revalidate = 300;

export default async function Landing() {
  const founder = founderOffer(await founderSeatsSold());
  return (
    <>
      <Header />
      <div className="bg-ink-900 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Ưu đãi Sáng lập: dùng trọn đời {vnd(founder.plan.price)},{" "}
        {founder.earlyLeft ? `còn ${founder.earlyLeft} suất giá này.` : `chỉ ${FOUNDER_SEATS} suất.`}{" "}
        <Link href="#bang-gia" className="underline underline-offset-2">
          Xem ngay
        </Link>
      </div>
      <main>
        <section className="mx-auto max-w-5xl px-4 pb-14 pt-14 text-center sm:px-6 sm:pt-20">
          <p className="inline-block rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600">
            Dành cho chủ doanh nghiệp, chủ shop và người kinh doanh một mình
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Trực giác của bạn đang âm thầm rút tiền khỏi túi bạn mỗi tháng.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Đổ thêm tiền vào thứ đang lỗ. Tin một bản báo cáo đang nói dối. Bỏ cuộc đúng lúc sắp có kết quả. Người giỏi nghề vẫn mắc cả 3. Trả
            lời 5 câu hỏi, 2 phút sau bạn biết mình đang mất tiền ở đâu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#kiem-tra" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              Kiểm tra miễn phí: tôi đang mắc bẫy nào?
            </Link>
            <Link href="#bang-gia" className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50">
              Xem bảng giá
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-500">Mất 2 phút · Không cần đăng ký · Số liệu không rời khỏi máy bạn</p>

          <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
            {PROOF.map(([big, small]) => (
              <div key={big} className="rounded-2xl border border-ink-200 bg-white p-5 text-left">
                <p className="text-2xl font-semibold tracking-tight text-ink-900">{big}</p>
                <p className="mt-1 text-sm leading-snug text-ink-600">{small}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mx-auto max-w-3xl text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Bạn không mất tiền vì một quyết định ngu ngốc. Bạn mất tiền vì những quyết định nghe rất hợp lý.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TRAPS.map((t) => (
              <article key={t.tag} className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
                <p className="font-mono text-xs text-accent-600">{t.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center font-semibold text-ink-900">
            Cả 3 bẫy có chung một điểm: cảm giác của bạn thấy rất đúng. Đó chính là lý do chúng nguy hiểm.
          </p>
        </section>

        <section id="kiem-tra" className="scroll-mt-20 border-y border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Bạn đang mắc bẫy nào?</h2>
            <p className="mt-2 text-sm text-ink-600">5 câu hỏi, mỗi câu 2 lựa chọn. Trả lời theo cách bạn thật sự sẽ làm.</p>
            <div className="mt-8">
              <Quiz />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Một chiếc kính hiển vi cho quyết định của bạn.</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              Không khoá học. Không lý thuyết. Không công thức phải nhớ. Bạn nhập con số kinh doanh thật, máy tính toán, rồi nói thẳng cho bạn
              biết nên làm gì, nên dừng gì.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.name} href={t.href} className="group rounded-2xl border border-ink-200 bg-white p-6 hover:border-ink-900">
                <p className="text-2xl text-accent-600">{t.n}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                  <span className="font-semibold text-ink-700">Dùng khi:</span> {t.when}
                </p>
                <p className="mt-4 text-sm font-semibold text-ink-900 group-hover:underline">Thử miễn phí →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-ink-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Chuyện thường gặp ngoài đời</h2>
            <p className="mt-2 text-center text-xs text-ink-500">Tình huống minh hoạ, dựng từ những lỗi chủ doanh nghiệp hay mắc nhất.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {CASES.map((c) => (
                <article key={c.who} className="flex flex-col rounded-2xl border border-ink-200 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.who}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{c.story}</p>
                  <p className="mt-4 rounded-xl bg-ink-50 px-4 py-3 text-sm font-semibold text-ink-900">{c.result}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-center font-semibold text-ink-900">
              Không ai trong số họ thiếu kinh nghiệm. Họ chỉ thiếu một thứ dám cãi lại cảm giác của mình.
            </p>
          </div>
        </section>

        <section id="bang-gia" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Một quyết định sai tốn hàng chục triệu. Công cụ giúp tránh nó chỉ bằng một bữa cà phê mỗi tuần.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-600">
              Một chiến dịch chạy sai 1 tháng: 10–50 triệu. Một nhân sự giỏi nghỉ vì bị đánh giá sai: không tính được. Trọn đời The Paradox
              Matrix: {vnd(founder.plan.price)}.
            </p>
          </div>
          <PricingTable founder={founder} />
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-ink-200 bg-white p-5 text-center">
            <p className="font-semibold text-ink-900">Hoàn tiền 100% trong 7 ngày</p>
            <p className="mt-1 text-sm text-ink-600">
              Nếu công cụ không chỉ ra được ít nhất một chỗ bạn đang quyết định sai, nhắn Zalo, chúng tôi trả lại tiền. Không hỏi lý do.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-ink-500">Thanh toán QR ngân hàng · Pro mở khoá trong vài giây, không cần chờ duyệt</p>
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
          <div className="mt-14 text-center">
            <p className="text-2xl font-semibold tracking-tight text-ink-900">Bạn có thể tiếp tục đoán. Hoặc bạn có thể biết.</p>
            <Link href="#kiem-tra" className="mt-6 inline-block rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              Kiểm tra miễn phí ngay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
