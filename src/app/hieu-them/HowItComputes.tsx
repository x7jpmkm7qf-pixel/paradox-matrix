import type { ReactNode } from "react";
import { computePosterior, evaluateDecision, naturalFrequencies, simulatePosterior } from "@/lib/bayes";
import { analyseSimpson, SIMPSON_PRESETS } from "@/lib/simpson";
import { exponentialAt, findTippingPoint, GROWTH_PRESETS, linearAt } from "@/lib/growth";
import { money, num, pct } from "@/lib/format";
import { FrequencyFigure, GrowthFigure, SimpsonFigure } from "./Figures";

/*
 * Every number on this section is computed at build time by the same functions the tools run,
 * so the worked examples can never drift from what the product actually does.
 */

// Tool 01: a project that started at 40%, then showed 3 weak months.
const bayesInputs = { prior: 0.4, sensitivity: 0.2, falsePositive: 0.8, signalObserved: true };
const bayes = computePosterior(bayesInputs);
const freq = naturalFrequencies(bayesInputs);
const simulated = simulatePosterior(bayesInputs, 20_000, 7).at(-1)!.estimate;
const money4 = { sunkCost: 500, remainingCost: 300, payoff: 1200, alternativeValue: 250 };
const decision = evaluateDecision({ posterior: bayes.posterior, ...money4 });

// Tool 02: the in-app "two sales teams" sample.
const team = SIMPSON_PRESETS.find((p) => p.id === "sales-team")!;
const simpson = analyseSimpson(team.rows);
const [small, large] = simpson.segments;

// Tool 03: the in-app content channel sample.
const channel = GROWTH_PRESETS.find((p) => p.id === "content")!;
const g = channel.inputs;
const tipping = findTippingPoint(g)!;
const quitWeek = 21;
const atQuit = exponentialAt(g.start, g.rate, quitWeek);
const finalValue = exponentialAt(g.start, g.rate, g.periods);

interface Machine {
  id: string;
  tag: string;
  name: string;
  method: string;
  steps: ReactNode[];
  check?: ReactNode;
  origin: ReactNode;
  figure: ReactNode;
}

const MACHINES: Machine[] = [
  {
    id: "may-01",
    tag: "Công cụ 01 · Tiếc tiền",
    name: "Cập nhật cơ hội thành công, rồi so hai con đường bằng tiền",
    method: "Định lý Bayes + giá trị kỳ vọng",
    figure: <FrequencyFigure f={freq} evContinue={decision.evContinue} evStop={decision.evStop} />,
    steps: [
      <>
        Lúc bắt đầu, cơ hội thành công là <b>{pct(bayesInputs.prior, 0)}</b>. Sau đó doanh số 3 tháng liền dưới kế hoạch. Dấu hiệu này gặp ở{" "}
        {pct(bayesInputs.sensitivity, 0)} dự án rồi vẫn thành công, nhưng gặp ở {pct(bayesInputs.falsePositive, 0)} dự án thất bại.
      </>,
      <>
        Máy đổi ra số người cho dễ hình dung: trong {num(freq.population)} dự án giống vậy, {num(freq.successes)} thành công và{" "}
        {num(freq.truePositives)} trong số đó có 3 tháng yếu. {num(freq.failures)} thất bại và {num(freq.falsePositives)} trong số đó có 3
        tháng yếu.
      </>,
      <>
        Bạn đang ở nhóm có 3 tháng yếu: {num(freq.truePositives)} thành công trên tổng {num(freq.truePositives + freq.falsePositives)}. Cơ
        hội thật bây giờ chỉ còn <b>{pct(bayes.posterior)}</b>, không phải {pct(bayesInputs.prior, 0)}.
      </>,
      <>
        So tiền tương lai, bỏ qua {money(money4.sunkCost)} đã chi vì dừng hay chạy cũng không lấy lại được. Chạy tiếp:{" "}
        {pct(bayes.posterior)} × {money(money4.payoff)} lãi − {money(money4.remainingCost)} chi thêm = <b>{money(decision.evContinue)}</b>.
        Dừng và làm việc khác: <b>{money(decision.evStop)}</b>.
      </>,
      <>
        Kết luận: dừng lại tốt hơn <b>{money(decision.evStop - decision.evContinue)}</b>. Lý do duy nhất khiến chạy tiếp có vẻ hấp dẫn là{" "}
        {money(money4.sunkCost)} đã chi, nên máy bật cảnh báo &quot;đang chạy tiếp chỉ vì tiếc tiền&quot;.
      </>,
    ],
    check: (
      <>
        Máy còn tự kiểm tra lại bằng cách cho chạy thử {num(20_000)} dự án giả lập ngẫu nhiên. Tỷ lệ thành công trong nhóm có 3 tháng yếu ra{" "}
        <b>{pct(simulated)}</b>, khớp với phép tính {pct(bayes.posterior)}.
      </>
    ),
    origin: (
      <>
        Định lý Bayes được công bố năm 1763, nay là nền của chẩn đoán y khoa, lọc thư rác và chấm điểm tín dụng. Cách đổi xác suất ra
        &quot;số người trên 1.000&quot; theo nghiên cứu của nhà tâm lý học Gerd Gigerenzer, giúp người không học thống kê vẫn hiểu đúng.
        Thói tiếc tiền đã chi được đo trong thí nghiệm của Arkes và Blumer (1985).
      </>
    ),
  },
  {
    id: "may-02",
    tag: "Công cụ 02 · Báo cáo đánh lừa",
    name: "Tách nhóm, so sòng phẳng, tìm nhóm làm lệch con số tổng",
    method: "Phát hiện nghịch lý Simpson + chuẩn hoá theo cơ cấu khách",
    figure: <SimpsonFigure report={simpson} labelA={team.labelA} labelB={team.labelB} />,
    steps: [
      <>
        Con số tổng: {team.labelB} chốt <b>{pct(simpson.total.bRate)}</b>, {team.labelA} chỉ {pct(simpson.total.aRate)}. Nhìn vậy thì{" "}
        {team.labelB} giỏi hơn.
      </>,
      <>
        Máy tách theo nhóm khách. {small.segment}: {team.labelA} {pct(small.aRate)}, {team.labelB} {pct(small.bRate)}. {large.segment}:{" "}
        {team.labelA} {pct(large.aRate)}, {team.labelB} {pct(large.bRate)}. <b>{team.labelA} thắng ở cả hai nhóm.</b>
      </>,
      <>
        Máy tìm thủ phạm: {pct(small.bMix, 0)} khách của {team.labelB} là nhóm {small.segment} (dễ chốt), còn {team.labelA} chỉ có{" "}
        {pct(small.aMix, 0)}. {team.labelB} trông giỏi vì được giao khách dễ.
      </>,
      <>
        Máy cho hai đội cùng một cơ cấu khách rồi tính lại: {team.labelA} <b>{pct(simpson.aRateAdjusted)}</b>, {team.labelB}{" "}
        <b>{pct(simpson.bRateAdjusted)}</b>. So sòng phẳng thì {team.labelA} hơn.
      </>,
      <>Kết luận: con số tổng đang đánh lừa. Thưởng theo nó là thưởng nhầm người.</>,
    ],
    origin: (
      <>
        Nhà thống kê Edward Simpson mô tả hiện tượng này năm 1951. Ví dụ nổi tiếng nhất là Đại học Berkeley năm 1973: số tổng cho thấy
        trường nhận nữ ít hơn nam, nhưng tách theo từng khoa thì phần lớn khoa nhận nữ ngang hoặc nhiều hơn. Bộ số mẫu ở trên lấy từ một
        nghiên cứu y khoa thật về điều trị sỏi thận (Charig và cộng sự, 1986), chỉ đổi tên thành hai đội sales.
      </>
    ),
  },
  {
    id: "may-03",
    tag: "Công cụ 03 · Bỏ cuộc quá sớm",
    name: "Vẽ đường tăng trưởng thật cạnh mức bạn mong, tìm điểm bùng phát",
    method: "Mô hình tăng trưởng kép + tìm giao điểm",
    figure: <GrowthFigure g={g} tipping={tipping} quitWeek={quitWeek} periodLabel={channel.periodLabel} unit={channel.unit} />,
    steps: [
      <>
        Kênh có {num(g.start)} {channel.unit}, tăng {pct(g.rate, 0)} mỗi {channel.periodLabel}. Bạn thì mong mỗi {channel.periodLabel} thêm
        đều {num(g.linearStep)} người.
      </>,
      <>
        Máy tính từng {channel.periodLabel}: tăng kép là {num(g.start)} × {(1 + g.rate).toFixed(2).replace(".", ",")} nhân lên theo số{" "}
        {channel.periodLabel}, giống cách ngân hàng tính lãi kép. Mức bạn mong là {num(g.start)} + {num(g.linearStep)} × số{" "}
        {channel.periodLabel}.
      </>,
      <>
        {channel.periodLabel.charAt(0).toUpperCase() + channel.periodLabel.slice(1)} {quitWeek}: thực tế mới có{" "}
        <b>
          {num(Math.round(atQuit))} {channel.unit}
        </b>
        , trong khi bạn mong {num(linearAt(g.start, g.linearStep, quitWeek))}. Đây là lúc đa số bỏ cuộc.
      </>,
      <>
        Máy dò chính xác điểm hai đường cắt nhau: <b>{`${channel.periodLabel} ${num(Math.ceil(tipping))}`}</b>. Từ đó thực tế vượt mức mong
        và càng lúc càng bỏ xa.
      </>,
      <>
        Kết luận: cuối năm ({channel.periodLabel} {g.periods}) kênh đạt khoảng <b>{num(Math.round(finalValue / 100) * 100)}</b>{" "}
        {channel.unit}, gấp {num(Math.round(finalValue / atQuit))} lần lúc định bỏ. Bỏ ở {channel.periodLabel} {quitWeek} là bỏ ngay trước
        khi bật lên.
      </>,
    ],
    origin: (
      <>
        Công thức tăng trưởng kép là công thức lãi kép mà ngân hàng dùng hàng trăm năm, cũng là cách các nhà dịch tễ và nhà kinh tế mô tả
        mọi thứ tự cộng dồn. Điểm khác của công cụ là đặt nó cạnh đường &quot;mong đợi tuyến tính&quot; trong đầu bạn, rồi tìm đúng giao
        điểm thay vì đoán bằng cảm giác.
      </>
    ),
  },
];

export function HowItComputes() {
  return (
    <section id="ben-trong" className="scroll-mt-20 bg-ink-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs text-amber-300">Bên trong máy tính gì</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Không phải lời khuyên chung chung. Mỗi kết luận là một phép tính bạn kiểm lại được.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-300 sm:text-base">
          Dưới đây là đúng các bước mỗi công cụ chạy, với bộ số mẫu có sẵn trong ứng dụng. Mọi con số trong phần này do chính mã nguồn của
          công cụ tính ra khi trang được dựng, không ai gõ tay. Bạn mở công cụ, nhập cùng bộ số, sẽ ra đúng kết quả này.
        </p>

        <div className="mt-10 space-y-6">
          {MACHINES.map((m) => (
            <article key={m.id} id={m.id} className="scroll-mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{m.tag}</p>
                <span className="rounded-full border border-amber-300/40 px-3 py-1 font-mono text-[11px] text-amber-200">{m.method}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{m.name}</h3>

              <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div>
                  <ol className="space-y-4">
                    {m.steps.map((s, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs text-white">
                          {i + 1}
                        </span>
                        <p className="pt-0.5 text-sm leading-relaxed text-ink-200 [&_b]:text-white">{s}</p>
                      </li>
                    ))}
                  </ol>

                  {m.check && (
                    <p className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-100 [&_b]:text-white">
                      ✓ {m.check}
                    </p>
                  )}
                </div>
                <div className="lg:sticky lg:top-20 lg:self-start">{m.figure}</div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Nguồn gốc khoa học</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{m.origin}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
