"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/pixel";

type Trap = "tiec-tien" | "bao-cao" | "bo-cuoc";

const QUESTIONS: { q: string; a: string; b: string; trap: Trap }[] = [
  {
    q: "Một chiến dịch lỗ 2 tháng nhưng bạn đã chi 30 triệu. Bạn sẽ:",
    a: "Chạy thêm 1 tháng cho chắc",
    b: "Dừng lại, xem số liệu tuần gần nhất",
    trap: "tiec-tien",
  },
  {
    q: "Báo cáo tổng cho thấy kênh A ra đơn tốt hơn kênh B. Bạn sẽ:",
    a: "Dồn tiền sang kênh A",
    b: "Tách theo từng nhóm khách rồi mới quyết",
    trap: "bao-cao",
  },
  {
    q: "Làm nội dung 8 tuần, lượt theo dõi tăng rất chậm. Bạn nghĩ:",
    a: "Chắc không hợp, nên đổi hướng",
    b: "Xem tốc độ tăng mỗi tuần có đều không",
    trap: "bo-cuoc",
  },
  {
    q: "Nhân viên A chốt đơn tỷ lệ cao hơn nhân viên B. Bạn:",
    a: "Thưởng A",
    b: "Kiểm tra A và B có được giao cùng kiểu khách không",
    trap: "bao-cao",
  },
  {
    q: "Khi quyết chi một khoản tiền lớn, bạn dựa chủ yếu vào:",
    a: "Kinh nghiệm và cảm giác",
    b: "Số liệu cập nhật hằng tuần",
    trap: "tiec-tien",
  },
];

const RESULTS: Record<Trap, { title: string; body: string; href: string; cta: string }> = {
  "tiec-tien": {
    title: "Bạn đang dễ mắc bẫy Tiếc tiền",
    body: "Bạn có xu hướng chi tiếp vì những gì đã bỏ ra, thay vì vì cơ hội thắng phía trước. Đây là bẫy đốt tiền nhanh nhất với chủ doanh nghiệp.",
    href: "/app#bayes",
    cta: "Đo ngay: khoản này có nên chi tiếp?",
  },
  "bao-cao": {
    title: "Bạn đang dễ bị Báo cáo đánh lừa",
    body: "Bạn tin con số tổng khá nhanh. Nhưng con số tổng có thể nói ngược hoàn toàn với từng nhóm khách, khiến bạn thưởng nhầm người, cắt nhầm kênh.",
    href: "/app#simpson",
    cta: "Soi ngay báo cáo của bạn",
  },
  "bo-cuoc": {
    title: "Bạn đang dễ Bỏ cuộc quá sớm",
    body: "Bạn mong kết quả tăng đều theo công sức. Thực tế, nhiều thứ lì rất lâu rồi bật lên rất nhanh. Bỏ ở đoạn phẳng là để người khác nhặt thành quả.",
    href: "/app#exponential",
    cta: "Dự báo ngay: bao giờ bật lên?",
  },
};

export function Quiz() {
  const [answers, setAnswers] = useState<("a" | "b")[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;

  const choose = (choice: "a" | "b") => {
    const next = [...answers, choice];
    setAnswers(next);
    if (next.length === QUESTIONS.length) track("Lead", { content_name: "quiz" });
  };

  if (done) {
    const score: Record<Trap, number> = { "tiec-tien": 0, "bao-cao": 0, "bo-cuoc": 0 };
    answers.forEach((c, i) => c === "a" && score[QUESTIONS[i].trap]++);
    const worst = (Object.keys(score) as Trap[]).sort((x, y) => score[y] - score[x])[0];
    const clean = score[worst] === 0;
    const r = RESULTS[worst];
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6 text-left sm:p-8">
        <p className="font-mono text-xs text-accent-600">Kết quả của bạn</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
          {clean ? "Bạn đang quyết định khá tỉnh táo" : r.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {clean
            ? "Bạn trả lời đúng cả 5 câu. Giờ thử với số liệu thật của bạn, vì trên giấy thì dễ, lúc tiền thật đang chảy mới khó."
            : r.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={clean ? "/app" : r.href} className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white hover:bg-ink-800">
            {clean ? "Thử với số liệu thật" : r.cta}
          </Link>
          <button onClick={() => setAnswers([])} className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50">
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  const cur = QUESTIONS[step];
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 text-left sm:p-8">
      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>
          Câu {step + 1}/{QUESTIONS.length}
        </span>
        <span className="h-1.5 w-32 overflow-hidden rounded-full bg-ink-100">
          <span className="block h-full bg-accent-500 transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink-900">{cur.q}</h3>
      <div className="mt-5 grid gap-3">
        {(["a", "b"] as const).map((k) => (
          <button
            key={k}
            onClick={() => choose(k)}
            className="rounded-xl border border-ink-200 px-4 py-3 text-left text-sm text-ink-800 hover:border-ink-900 hover:bg-ink-50"
          >
            {cur[k]}
          </button>
        ))}
      </div>
    </div>
  );
}
