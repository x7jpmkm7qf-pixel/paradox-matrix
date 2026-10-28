import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Về chúng tôi · The Paradox Matrix",
  description: "Người đứng sau The Paradox Matrix, vì sao chúng tôi làm ra nó, và những điều chúng tôi cam kết với bạn.",
};

const MILESTONES = [
  {
    label: "Kinh doanh hàng thật",
    title: "Sáng lập Pharmatech AS",
    body: "Thương hiệu thực phẩm chức năng gốc Na Uy, phân phối tại Việt Nam. Nhập hàng, giữ tồn kho, trả lương, chạy quảng cáo mỗi ngày. Ở đó, mỗi quyết định sai đều hiện ra trên sổ sách bằng tiền thật.",
  },
  {
    label: "Kinh doanh số",
    title: "Xây hệ Tâm Lý Học VN",
    body: "Một mình dựng tamlyhocvn.club và trang Tâm Lý Học Ứng Dụng: sản phẩm số về tâm lý học ứng dụng, từ thanh toán, giao hàng đến quảng cáo đều chạy tự động.",
  },
  {
    label: "Hôm nay",
    title: "Đóng gói cách làm thành công cụ",
    body: "The Paradox Matrix là chính bộ luật anh Sơn dùng để quyết định mỗi ngày, được viết lại thành công cụ để chủ doanh nghiệp nào cũng dùng được, không cần biết toán.",
  },
];

const PROMISES = [
  {
    title: "Số thật, không số đẹp",
    body: "Công cụ không nói điều bạn muốn nghe. Nếu con số bảo dừng, nó sẽ nói dừng, kể cả khi bạn đã bỏ vào rất nhiều tiền.",
  },
  {
    title: "Nói thẳng, nói dễ hiểu",
    body: "Không thuật ngữ, không công thức phải nhớ. Mỗi kết luận là một câu tiếng Việt bạn có thể đọc to cho cộng sự nghe.",
  },
  {
    title: "Số liệu của bạn là của bạn",
    body: "Mọi phép tính chạy ngay trên trình duyệt của bạn. Chúng tôi không lưu, không xem, không bán số liệu kinh doanh của bạn.",
  },
  {
    title: "Không hài lòng, trả lại tiền",
    body: "Trong 7 ngày, nếu công cụ không chỉ ra được một chỗ bạn đang quyết định sai, nhắn Zalo là được hoàn 100%. Không hỏi lý do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-4xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
          <p className="font-mono text-xs text-accent-600">Về chúng tôi</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Chúng tôi làm ra công cụ này vì đã tự trả giá cho những quyết định theo cảm giác.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
            The Paradox Matrix không đến từ phòng thí nghiệm hay giảng đường. Nó đến từ nhiều năm tự bỏ tiền ra kinh doanh, và từ những lần
            thấy rõ: thứ làm doanh nghiệp mất tiền nhiều nhất hiếm khi là thiếu chăm chỉ.
          </p>
        </section>

        <section className="border-y border-ink-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Người sáng lập</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">Hán Văn Sơn</h2>
              <p className="mt-1 text-sm text-ink-500">Sáng lập The Paradox Matrix và hệ Tâm Lý Học VN</p>
              <div className="mt-6 rounded-2xl bg-ink-900 p-6 text-white">
                <p className="text-lg font-semibold leading-snug">
                  “Cảm giác rất giỏi làm ta thấy mình đúng. Con số thì không cần ta thấy gì cả.”
                </p>
                <p className="mt-3 text-xs text-ink-300">Nguyên tắc chúng tôi dùng mỗi ngày</p>
              </div>
            </div>
            <div className="space-y-5 text-[15px] leading-relaxed text-ink-700">
              <p>
                Trước khi làm phần mềm, anh Sơn sáng lập và điều hành <b>Pharmatech AS</b>, thương hiệu thực phẩm chức năng gốc Na Uy phân
                phối tại Việt Nam. Kinh doanh hàng thật nghĩa là mỗi tháng phải quyết: nhập thêm bao nhiêu, chi bao nhiêu cho quảng cáo, giữ
                kênh nào, bỏ kênh nào. Quyết sai thì tiền nằm chết trong kho hoặc cháy trên quảng cáo.
              </p>
              <p>
                Sau đó, anh tự tay xây hệ <b>Tâm Lý Học VN</b> cùng trang <b>Tâm Lý Học Ứng Dụng</b>, bán sản phẩm số về tâm lý học ứng dụng
                cho người Việt. Lần này anh làm một mình, và chạy quảng cáo bằng tiền của chính mình mỗi ngày.
              </p>
              <p>
                Qua cả hai lần làm chủ, anh thấy cùng một điều: những lần mất tiền đau nhất đều đến từ quyết định <i>nghe rất hợp lý</i>.
                Chạy tiếp vì tiếc tiền đã chi. Tin con số tổng trong báo cáo. Bỏ cuộc đúng lúc kết quả sắp đến.
              </p>
              <p>
                Vì vậy, ở Tâm Lý Học VN mọi quyết định quảng cáo đều theo luật cứng: <b>đo bằng tiền thật về tài khoản</b>, không tin cảm
                giác, không tin con số đẹp trên trình quản lý quảng cáo. Chiến dịch nào vượt mức chi phí cho phép trên mỗi đơn là cắt, bất
                kể đã đổ vào bao nhiêu.
              </p>
              <p>
                The Paradox Matrix là bộ luật đó, được đóng gói thành công cụ. Bạn không cần biết toán, không cần học thống kê. Bạn chỉ cần
                những con số mình đã có, và 5 phút.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">Chặng đường đến The Paradox Matrix</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <li key={m.title} className="rounded-2xl border border-ink-200 bg-white p-6">
                <p className="font-mono text-xs text-accent-600">
                  0{i + 1} · {m.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
              Bốn điều chúng tôi cam kết với bạn
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {PROMISES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-ink-200 bg-white p-6">
                  <h3 className="font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink-900">Thuộc hệ Tâm Lý Học VN</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              The Paradox Matrix là sản phẩm của hệ Tâm Lý Học VN, nơi chúng tôi đưa tâm lý học vào những việc rất đời thường: làm việc,
              kinh doanh, ra quyết định.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={SITE.brandUrl} className="font-medium text-ink-900 underline underline-offset-2">
                  tamlyhocvn.club
                </a>
              </li>
              <li>
                <a href={SITE.fanpageUrl} className="font-medium text-ink-900 underline underline-offset-2">
                  Trang Facebook Tâm Lý Học Ứng Dụng
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-ink-900">Thông tin liên hệ</h2>
            <dl className="mt-3 space-y-2 text-sm text-ink-600">
              <div>
                <dt className="inline font-medium text-ink-900">Đơn vị vận hành: </dt>
                <dd className="inline">{SITE.operator}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink-900">Zalo hỗ trợ: </dt>
                <dd className="inline">
                  <a href={`https://zalo.me/${SITE.zalo}`} className="underline underline-offset-2">
                    {SITE.zaloDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink-900">Email: </dt>
                <dd className="inline">
                  <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline font-medium text-ink-900">Thanh toán: </dt>
                <dd className="inline">chuyển khoản QR vào tài khoản ngân hàng đứng tên đơn vị vận hành, Pro mở khoá tự động.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
          <p className="text-2xl font-semibold tracking-tight text-ink-900">Đừng tin lời chúng tôi. Hãy thử với số liệu của bạn.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/#kiem-tra" className="rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
              Kiểm tra miễn phí: tôi đang mắc bẫy nào?
            </Link>
            <Link
              href="/hieu-them"
              className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              Hiểu kỹ hơn về 3 cái bẫy
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
