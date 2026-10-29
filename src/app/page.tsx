import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/site/PricingTable";
import { Quiz } from "@/components/site/Quiz";
import { HeroPreview } from "@/components/site/HeroPreview";
import { TrapArt } from "@/components/site/TrapArt";
import { MiniSim } from "@/components/site/MiniSim";
import { StickyFounderCta } from "@/components/site/StickyFounderCta";
import { EngineTeaser } from "@/components/site/EngineTeaser";
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
    art: "report" as const,
    title: "“Báo cáo nói kênh này tốt. Bạn dồn tiền vào. Rồi lỗ.”",
    body: "Nhìn tổng, chi nhánh A chốt đơn 78%, B chỉ 69%. Bạn thưởng A, cắt ngân sách B. Nhưng tách ra từng nhóm khách thì B thắng ở mọi nhóm. A trông đẹp chỉ vì được giao toàn khách dễ. Con số tổng không sai, nó chỉ đang giấu sự thật.",
  },
  {
    tag: "Bẫy 02 · Tiếc tiền đã chi",
    art: "sunk" as const,
    title: "“Đã lỡ đổ 50 triệu rồi, giờ dừng thì phí.”",
    body: "Số tiền đã chi không quay lại, dù bạn chạy tiếp hay dừng. Câu duy nhất đáng hỏi: từ hôm nay, mỗi đồng bỏ thêm còn bao nhiêu cơ hội sinh lời? Lúc đầu là 40%. Sau 3 tháng số liệu thật còn 12%. Nhưng bạn vẫn chạy, vì cảm giác không chịu cập nhật.",
  },
  {
    tag: "Bẫy 03 · Mong kết quả đi thẳng",
    art: "growth" as const,
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
    sim: "bayes" as const,
  },
  {
    n: "②",
    name: "Máy soi báo cáo",
    body: "Dán bảng số liệu từ Excel hay Google Sheets. Công cụ tự tách theo nhóm khách, kênh, khu vực, rồi chỉ ra chỗ con số tổng đang nói ngược với thực tế.",
    when: "Sắp thưởng, cắt ngân sách hay chọn kênh dựa trên báo cáo tổng.",
    href: "/app#simpson",
    sim: "simpson" as const,
  },
  {
    n: "③",
    name: "Máy dự báo “bao giờ bật lên?”",
    body: "Nhập tốc độ tăng hiện tại. Công cụ vẽ ra đoạn phẳng còn kéo dài bao lâu và điểm bật nằm ở đâu, để bạn quyết dừng hay trụ bằng con số, không bằng cảm xúc.",
    when: "Muốn bỏ một kênh nội dung, một sản phẩm mới, một thị trường mới.",
    href: "/app#exponential",
    sim: "exponential" as const,
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

const QUESTIONS = [
  ["01", "Có nên chi tiếp?", "/app#bayes"],
  ["02", "Báo cáo có đang nói dối?", "/app#simpson"],
  ["03", "Bỏ hay trụ thêm?", "/app#exponential"],
];

const STEPS = [
  ["Chọn điều bạn đang phân vân", "Nên chi tiếp hay dừng? Báo cáo này có đúng không? Bỏ hay trụ? Mỗi câu hỏi là một công cụ."],
  ["Nhập vài con số bạn đã có", "Tiền đã chi, số đơn, số người theo dõi. Chưa có số? Mỗi công cụ có sẵn số mẫu để bạn thử trước."],
  ["Đọc kết luận bằng tiếng Việt", "Ô xanh: làm tiếp. Ô đỏ: dừng lại nghĩ. Kèm con số cụ thể để bạn giải thích với cộng sự, với sếp."],
];

const FOR_WHO = [
  "Chủ shop online đang chạy quảng cáo Facebook, TikTok",
  "Chủ doanh nghiệp nhỏ có đội sales hoặc nhiều chi nhánh",
  "Người làm nội dung, xây kênh, xây thương hiệu cá nhân",
  "Quản lý phải duyệt ngân sách, thưởng phạt dựa trên báo cáo",
];

const NOT_FOR = [
  "Bạn cần phần mềm kế toán, quản lý kho, bán hàng",
  "Bạn muốn một công cụ tự chạy quảng cáo hộ mình",
  "Bạn chỉ muốn nghe điều mình muốn nghe",
];

const TRUST = [
  [
    "Toán đã được kiểm chứng",
    "Xác suất và thống kê mà ngân hàng, bác sĩ, nhà khoa học dùng hàng trăm năm, viết lại bằng tiếng Việt đời thường.",
  ],
  ["Số liệu không rời máy bạn", "Mọi phép tính chạy ngay trên trình duyệt. Chúng tôi không lưu, không xem số liệu kinh doanh của bạn."],
  [
    "Người làm ra cũng kinh doanh thật",
    "Công cụ đóng gói từ chính bộ luật người sáng lập dùng để chạy quảng cáo và ra quyết định mỗi ngày.",
  ],
  ["Hoàn tiền 7 ngày", "Không chỉ ra được một chỗ bạn đang quyết định sai thì trả lại 100% tiền. Không hỏi lý do."],
];

const VS_AI = [
  {
    label: "Tầng 1",
    title: "AI cho bạn lý thuyết. Công cụ này cho bạn một quyết định.",
    body: "Hỏi ChatGPT “có nên chạy tiếp chiến dịch này không?”, bạn nhận về 5 gạch đầu dòng và câu quen thuộc “tuỳ vào tình hình của bạn”. Nghe hay, nhưng không ai chịu nói thẳng. The Paradox Matrix lấy số liệu thật của bạn và trả về một câu: dừng, hay chạy tiếp. Nó chỉ thẳng chỗ bạn đang tự lừa mình, kể cả khi bạn không muốn nghe.",
    ai: "“Tuỳ trường hợp, bạn nên cân nhắc…”",
    pm: "“Dừng. Mỗi đồng chi thêm đang lỗ.”",
  },
  {
    label: "Tầng 2",
    title: "Lúc đang lỗ, không ai đủ bình tĩnh để hỏi AI cho đúng.",
    body: "AI trả lời tốt đến đâu là do câu hỏi tốt đến đâu. Nhưng khi tiền đang cháy, bạn sẽ hỏi theo cách bạn muốn được trấn an: “chiến dịch này sắp ra đơn rồi đúng không?”. Và AI sẽ chiều theo bạn. Công cụ này đã đặt sẵn đúng câu hỏi và đúng ô số liệu cần điền. Bạn không có chỗ để biện minh, chỉ có chỗ để điền sự thật.",
    ai: "Câu hỏi do cảm xúc của bạn viết",
    pm: "Khung câu hỏi cố định, không lách được",
  },
  {
    label: "Tầng 3",
    title: "Người tỉnh táo không mua thông tin. Họ mua thời gian.",
    body: "Thông tin thì miễn phí, trên mạng có cả. Cái không miễn phí là 1 tiếng ngồi gõ qua gõ lại với AI, tự kiểm tra xem nó tính đúng chưa, rồi vẫn phải tự quyết. Ở đây bạn điền vài con số, 2 phút sau có kết luận. Lần sau mở ra là dùng ngay, không phải nghĩ lại từ đầu.",
    ai: "Gõ, sửa, hỏi lại, tự kiểm tra: 1 tiếng",
    pm: "Điền số, đọc kết luận: 2 phút",
  },
];

const PLATFORM = [
  {
    tag: "Công cụ",
    title: "Một bộ công cụ, mua một lần dùng tất",
    body: "3 công cụ cho 3 cái bẫy tốn tiền nhất, chung một chỗ. Công cụ mới được thêm vào nền tảng theo thời gian, bạn không phải mua lẻ từng cái.",
  },
  {
    tag: "Cách nghĩ",
    title: "Một khung quyết định dùng lại mãi",
    body: "Mỗi lần phân vân, bạn đi đúng một lối: nhập số, đọc kết luận, làm. Dùng vài lần, bạn tự nhận ra bẫy trước cả khi mở máy.",
  },
  {
    tag: "Con người",
    title: "Có người thật đồng hành",
    body: "Gói Pro năm và Sáng lập có buổi 1:1 với huấn luyện viên để cùng soi một quyết định thật của bạn. Thành viên Sáng lập còn được Zalo trực tiếp với anh Sơn, người sáng lập, để được cố vấn.",
  },
  {
    tag: "Cộng đồng",
    title: "Một nhóm chủ doanh nghiệp cùng chí hướng",
    body: "Thành viên Sáng lập vào nhóm Zalo riêng: hỏi nhau, chia sẻ quyết định đã cứu tiền thế nào, và góp ý công cụ tiếp theo nên làm gì.",
  },
];

const FAQ = [
  {
    q: "The Paradox Matrix là công cụ hay nền tảng?",
    a: "Là nền tảng. Bên trong có bộ công cụ ra quyết định (hiện có 3, sẽ thêm dần), huấn luyện viên 1:1 cho gói Pro năm và Sáng lập, và cộng đồng thành viên Sáng lập. Bạn trả một lần cho cả nền tảng, không mua lẻ từng công cụ.",
  },
  {
    q: "Dùng miễn phí được bao nhiêu?",
    a: "Bài kiểm tra và dữ liệu mẫu dùng thoải mái, không cần đăng ký. Với số liệu của chính bạn, bạn tạo một tài khoản miễn phí (chỉ cần email) và được xem trọn kết luận 3 lần. Sau đó nâng cấp Pro để dùng không giới hạn, từ 678.000đ cho 6 tháng (khoảng 113.000đ mỗi tháng).",
  },
  {
    q: "Sao tôi không tự hỏi ChatGPT hay Claude cho rẻ?",
    a: "Bạn hoàn toàn có thể hỏi. Nhưng AI chung chung đưa lý thuyết và câu “tuỳ trường hợp”, còn The Paradox Matrix đưa một quyết định từ số liệu thật của bạn, trong 2 phút, với khung câu hỏi không cho bạn tự trấn an. Xem phần so sánh ngay phía trên bảng giá.",
  },
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
    a: "Kế toán ghi lại chuyện đã xảy ra. The Paradox Matrix giúp bạn quyết định chuyện sắp xảy ra.",
  },
  {
    q: "Ai đứng sau The Paradox Matrix?",
    a: "Anh Hán Văn Sơn, người sáng lập Pharmatech AS và hệ Tâm Lý Học VN. Nền tảng được xây từ chính cách anh ra quyết định kinh doanh mỗi ngày. Xem thêm ở trang Về chúng tôi.",
  },
  {
    q: "Có cần cài đặt hay đăng ký tài khoản không?",
    a: "Không cần cài gì, mở trình duyệt là dùng được, trên máy tính hay điện thoại đều được. Bài kiểm tra và số mẫu không cần đăng ký. Để xem kết luận với số của bạn, bạn tạo tài khoản miễn phí bằng email; Pro và lượt dùng sẽ đi theo tài khoản trên mọi máy.",
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
      <main>
        <section className="relative overflow-hidden bg-night-950 text-white">
          <div
            className="pm-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
            aria-hidden="true"
          />
          <div
            className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-600/25 blur-[120px]"
            aria-hidden="true"
          />
          <div className="absolute -bottom-40 right-0 h-[360px] w-[480px] rounded-full bg-flame-500/10 blur-[120px]" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pb-20">
            <div className="animate-rise text-center lg:text-left">
              <Link
                href="#bang-gia"
                className="inline-flex items-center gap-2 rounded-full border border-flame-500/40 bg-flame-500/10 px-3 py-1 text-xs font-medium text-flame-300 hover:bg-flame-500/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-flame-500" />
                </span>
                Ưu đãi Sáng lập: trọn đời {vnd(founder.plan.price)},{" "}
                {founder.earlyLeft ? `còn ${founder.earlyLeft} suất` : `chỉ ${FOUNDER_SEATS} suất`} →
              </Link>
              <p className="mt-5 text-sm font-medium text-accent-300">
                Nền tảng ra quyết định bằng con số cho chủ doanh nghiệp, chủ shop và người kinh doanh một mình
              </p>
              <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Trực giác của bạn đang âm thầm{" "}
                <span className="bg-gradient-to-r from-flame-400 to-flame-500 bg-clip-text text-transparent">rút tiền khỏi túi bạn</span>{" "}
                mỗi tháng.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg lg:mx-0">
                Đổ thêm tiền vào thứ đang lỗ. Tin một bản báo cáo đang nói dối. Bỏ cuộc đúng lúc sắp có kết quả. Người giỏi nghề vẫn mắc cả
                3. Trả lời 5 câu hỏi, 2 phút sau bạn biết mình đang mất tiền ở đâu.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="#kiem-tra"
                  className="rounded-xl bg-flame-500 px-6 py-3.5 text-center text-sm font-bold text-night-950 shadow-flame transition hover:-translate-y-0.5 hover:bg-flame-400"
                >
                  Kiểm tra miễn phí: tôi đang mắc bẫy nào?
                </Link>
                <Link
                  href="#bang-gia"
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10"
                >
                  Xem bảng giá
                </Link>
              </div>
              <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ink-400 lg:justify-start">
                {["Mất 2 phút", "Kiểm tra không cần đăng ký", "Số liệu không rời khỏi máy bạn"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="#thuc-chien"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-flame-300 underline decoration-flame-500/40 underline-offset-4 hover:text-flame-400"
              >
                Mới: 6 nghịch lý áp dụng ngay cho shop nhỏ, đội ngũ và lãnh đạo →
              </Link>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">3 câu hỏi đáng tiền nhất</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                {QUESTIONS.map(([n, q, href]) => (
                  <Link
                    key={n}
                    href={href}
                    className="pm-glass rounded-full px-3.5 py-1.5 text-sm font-medium text-white transition hover:border-accent-400/60 hover:bg-white/10"
                  >
                    <span className="mr-1.5 font-semibold text-accent-400">{n}</span>
                    {q}
                  </Link>
                ))}
              </div>
            </div>

            <HeroPreview />
          </div>

          <div className="relative border-t border-white/10 bg-night-900/60">
            <div className="mx-auto grid max-w-6xl gap-px px-4 sm:grid-cols-3 sm:px-6">
              {PROOF.map(([big, small]) => (
                <div key={big} className="py-4 text-center sm:py-6 sm:px-6 sm:text-left">
                  <p className="text-2xl font-bold tracking-tight text-flame-400 sm:text-3xl">{big}</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-snug text-ink-300 sm:mx-0">{small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
          <h2 className="mx-auto max-w-3xl text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Bạn không mất tiền vì một quyết định ngu ngốc. Bạn mất tiền vì những quyết định nghe rất hợp lý.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TRAPS.map((t) => (
              <article
                key={t.tag}
                className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="border-b border-ink-100 bg-gradient-to-b from-accent-50 to-white px-6 pb-2 pt-5">
                  <TrapArt kind={t.art} />
                </div>
                <div className="p-6 pt-4">
                  <p className="font-mono text-xs font-semibold text-flame-600">{t.tag}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center font-semibold text-ink-900">
            Cả 3 bẫy có chung một điểm: cảm giác của bạn thấy rất đúng. Đó chính là lý do chúng nguy hiểm.
          </p>
          <p className="mt-3 text-center text-sm">
            <Link href="/hieu-them" className="font-medium text-accent-700 underline underline-offset-2">
              Đọc kỹ hơn: vì sao người giỏi vẫn mắc, và cách tự kiểm tra →
            </Link>
          </p>
        </section>

        <section id="kiem-tra" className="scroll-mt-20 border-y border-accent-100 bg-gradient-to-b from-accent-50 to-white">
          <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
            <p className="inline-block rounded-full bg-flame-500/15 px-3 py-1 text-xs font-semibold text-flame-600">Miễn phí · 2 phút</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Bạn đang mắc bẫy nào?</h2>
            <p className="mt-2 text-sm text-ink-600">5 câu hỏi, mỗi câu 2 lựa chọn. Trả lời theo cách bạn thật sự sẽ làm.</p>
            <div className="mt-8">
              <Quiz />
            </div>
          </div>
        </section>

        <EngineTeaser />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Một chiếc kính hiển vi cho quyết định của bạn.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              Không khoá học. Không lý thuyết. Không công thức phải nhớ. Bạn nhập con số kinh doanh thật, máy tính toán, rồi nói thẳng cho
              bạn biết nên làm gì, nên dừng gì.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-ink-200 bg-white p-6 transition hover:border-accent-400 hover:shadow-lg"
              >
                <p className="flex h-10 w-10 items-center justify-center rounded-xl bg-night-900 text-xl text-accent-400">{t.n}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
                <p className="mt-4 text-xs leading-relaxed text-ink-500">
                  <span className="font-semibold text-ink-700">Dùng khi:</span> {t.when}
                </p>
                <div className="mt-5 flex-1">
                  <MiniSim kind={t.sim} />
                </div>
                <Link href={t.href} className="mt-4 text-sm font-semibold text-accent-700 hover:underline">
                  Thử với số liệu thật của bạn →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Dùng thế nào? 3 bước, 5 phút.</h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="rounded-2xl border border-ink-200 bg-white p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-sm font-bold text-night-950">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-ink-200 bg-white p-6">
                <h3 className="font-semibold text-ink-900">Dành cho bạn nếu bạn là</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  {FOR_WHO.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-white p-6">
                <h3 className="font-semibold text-ink-900">Chưa phù hợp nếu</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-700">
                  {NOT_FOR.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-ink-400">✕</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-ink-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="text-center font-mono text-xs text-accent-600">Không phải một công cụ lẻ</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Một nền tảng để mọi quyết định tiền bạc đi qua con số trước
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-600">
              Một công cụ giải một bài toán rồi thôi. The Paradox Matrix là nơi bạn quay lại mỗi khi phải quyết định: có công cụ, có cách
              nghĩ, có người đồng hành và có cộng đồng.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PLATFORM.map((p) => (
                <div key={p.title} className="rounded-2xl border border-ink-200 bg-ink-50/60 p-6">
                  <p className="font-mono text-xs font-semibold text-accent-600">{p.tag}</p>
                  <h3 className="mt-2 font-semibold leading-snug text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Vì sao bạn có thể tin kết luận của nó?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-ink-200 bg-white p-6">
                <h3 className="font-semibold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-night-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">Người đứng sau</p>
              <p className="mt-2 text-lg font-semibold leading-snug">
                Hán Văn Sơn, sáng lập Pharmatech AS và hệ Tâm Lý Học VN. Hai lần làm chủ, một bài học: tiền mất nhiều nhất ở những quyết
                định nghe rất hợp lý.
              </p>
            </div>
            <Link
              href="/ve-chung-toi"
              className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-ink-100"
            >
              Đọc câu chuyện →
            </Link>
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

        <section id="sao-khong-hoi-ai" className="relative scroll-mt-20 overflow-hidden bg-night-950 text-white">
          <div
            className="pm-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-center font-mono text-xs text-ink-300">Câu hỏi ai cũng nghĩ tới</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-center text-2xl font-semibold tracking-tight sm:text-4xl">
              “Sao tôi phải mua, trong khi có thể hỏi ChatGPT hay Claude miễn phí?”
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-ink-300 sm:text-base">
              Câu hỏi hay. Chúng tôi dùng AI mỗi ngày, và chính vì dùng nhiều nên biết rõ nó giỏi ở đâu, hụt ở đâu. Đây là câu trả lời
              thẳng.
            </p>
            <div className="mt-12 space-y-4">
              {VS_AI.map((v) => (
                <article
                  key={v.label}
                  className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr]"
                >
                  <div>
                    <p className="font-mono text-xs text-accent-400">{v.label}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-[15px]">{v.body}</p>
                  </div>
                  <dl className="grid content-center gap-3 text-sm">
                    <div className="rounded-xl border border-white/10 px-4 py-3">
                      <dt className="text-xs uppercase tracking-wide text-ink-400">Hỏi AI chung chung</dt>
                      <dd className="mt-1 text-ink-200">{v.ai}</dd>
                    </div>
                    <div className="rounded-xl bg-white px-4 py-3 text-ink-900">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-accent-600">The Paradox Matrix</dt>
                      <dd className="mt-1 font-semibold">{v.pm}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-12 max-w-3xl text-center text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              ChatGPT dùng để tra cứu khi rảnh rỗi.
              <br />
              <span className="text-flame-400">The Paradox Matrix dùng để cứu tiền khi doanh nghiệp gặp bão.</span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="#kiem-tra"
                className="rounded-xl bg-flame-500 px-6 py-3 text-sm font-bold text-night-950 shadow-flame hover:bg-flame-400"
              >
                Thử miễn phí với số liệu của bạn
              </Link>
              <Link
                href="#bang-gia"
                className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Xem bảng giá
              </Link>
            </div>
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
          <div className="relative mt-14 overflow-hidden rounded-3xl bg-night-950 px-6 py-12 text-center">
            <div className="pm-grid absolute inset-0" aria-hidden="true" />
            <div
              className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent-600/30 blur-3xl"
              aria-hidden="true"
            />
            <p className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bạn có thể tiếp tục đoán. Hoặc bạn có thể <span className="text-flame-400">biết.</span>
            </p>
            <Link
              href="#kiem-tra"
              className="relative mt-6 inline-block rounded-xl bg-flame-500 px-6 py-3 text-sm font-bold text-night-950 shadow-flame hover:bg-flame-400"
            >
              Kiểm tra miễn phí ngay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      {!founder.soldOut && (
        <>
          {/* Room so the pinned phone bar never covers the footer. */}
          <div className="h-20 bg-white sm:hidden" aria-hidden="true" />
          <StickyFounderCta
            price={vnd(founder.plan.price)}
            seatsNote={founder.earlyLeft ? `còn ${founder.earlyLeft} suất giá này` : `chỉ ${FOUNDER_SEATS} suất`}
          />
        </>
      )}
    </>
  );
}
