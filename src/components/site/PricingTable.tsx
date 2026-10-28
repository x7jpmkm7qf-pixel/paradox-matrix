import Link from "next/link";
import { FOUNDER_EARLY_SEATS, FOUNDER_LATE, FOUNDER_SEATS, FREE_FEATURES, plansFor, vnd, type FounderOffer } from "@/lib/plans";

function founderLadder({ plan, earlyLeft, sold }: FounderOffer): string {
  if (sold === null) return `${FOUNDER_EARLY_SEATS} suất đầu giá ${vnd(plan.price)}, sau đó ${vnd(FOUNDER_LATE.price)}`;
  if (earlyLeft) return `Còn ${earlyLeft} suất giá này, sau đó tăng lên ${vnd(FOUNDER_LATE.price)}`;
  return `${FOUNDER_EARLY_SEATS} suất giá đợt đầu đã có chủ`;
}

export function PricingTable({ founder }: { founder: FounderOffer }) {
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="flex flex-col rounded-2xl border border-ink-200 bg-white p-6">
          <p className="text-sm font-semibold text-ink-900">Miễn phí</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">0đ</p>
          <p className="mt-1 text-xs text-ink-500">Xem số mẫu không cần đăng ký</p>
          <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-600">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-ink-400">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/app"
            className="mt-6 rounded-lg border border-ink-200 px-4 py-2 text-center text-sm font-medium text-ink-800 hover:bg-ink-50"
          >
            Dùng thử ngay
          </Link>
        </div>

        {plansFor(founder).map((plan) => {
          const featured = plan.id === "founder";
          const badge = featured && founder.seatsLeft !== null ? `Còn ${founder.seatsLeft}/${FOUNDER_SEATS} suất` : plan.badge;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${featured ? "border-ink-900 bg-ink-900 text-white shadow-xl" : plan.badge ? "border-ink-900 bg-white ring-1 ring-ink-900" : "border-ink-200 bg-white"}`}
            >
              {badge && (
                <span
                  className={`absolute -top-3 left-6 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    featured ? "bg-accent-500 text-white" : "bg-ink-900 text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
              <p className={`text-sm font-semibold ${featured ? "text-white" : "text-ink-900"}`}>{plan.name}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {vnd(plan.price)}
                <span className={`ml-1 text-sm font-normal ${featured ? "text-ink-300" : "text-ink-500"}`}>{plan.period}</span>
              </p>
              <p className={`mt-1 text-xs ${featured ? "text-accent-200" : "text-ink-500"}`}>{plan.note}</p>
              {featured && <p className="mt-2 text-xs font-semibold text-amber-300">{founderLadder(founder)}</p>}
              <ul className={`mt-5 flex-1 space-y-2 text-sm ${featured ? "text-ink-200" : "text-ink-600"}`}>
                <li className="flex gap-2">
                  <span className={featured ? "text-accent-300" : "text-accent-600"}>✓</span>
                  <span className="font-medium">{plan.includes}</span>
                </li>
                {plan.perks.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={featured ? "text-accent-300" : "text-accent-600"}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {featured && founder.soldOut ? (
                <span className="mt-6 rounded-lg bg-ink-700 px-4 py-2 text-center text-sm font-medium text-ink-300">Đã hết suất</span>
              ) : (
                <Link
                  href={`/thanh-toan?goi=${plan.id}`}
                  className={`mt-6 rounded-lg px-4 py-2 text-center text-sm font-medium ${
                    featured ? "bg-white text-ink-900 hover:bg-ink-100" : "bg-ink-900 text-white hover:bg-ink-800"
                  }`}
                >
                  {featured ? "Giữ suất Sáng lập" : `Chọn ${plan.name}`}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-ink-600">
        <span className="font-semibold text-ink-900">Nâng gói không mất tiền cũ:</span> số tiền bạn đã trả trong 30 ngày gần nhất được trừ
        thẳng vào gói cao hơn. Nhắn Zalo hỗ trợ để được trừ.
      </p>
    </div>
  );
}
