import Link from "next/link";
import { FREE_FEATURES, PLANS, PRO_FEATURES, vnd } from "@/lib/plans";

export function PricingTable() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="flex flex-col rounded-2xl border border-ink-200 bg-white p-6">
        <p className="text-sm font-semibold text-ink-900">Miễn phí</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">0đ</p>
        <p className="mt-1 text-xs text-ink-500">Không cần đăng ký</p>
        <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-600">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-ink-400">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <Link href="/app" className="mt-6 rounded-lg border border-ink-200 px-4 py-2 text-center text-sm font-medium text-ink-800 hover:bg-ink-50">
          Dùng thử ngay
        </Link>
      </div>

      {PLANS.map((plan) => {
        const featured = plan.id === "pro-year";
        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 ${featured ? "border-ink-900 bg-ink-900 text-white shadow-xl" : "border-ink-200 bg-white"}`}
          >
            {featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                Tiết kiệm nhất
              </span>
            )}
            <p className={`text-sm font-semibold ${featured ? "text-white" : "text-ink-900"}`}>{plan.name}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {vnd(plan.price)}
              <span className={`ml-1 text-sm font-normal ${featured ? "text-ink-300" : "text-ink-500"}`}>{plan.period}</span>
            </p>
            <p className={`mt-1 text-xs ${featured ? "text-accent-200" : "text-ink-500"}`}>{plan.note}</p>
            <ul className={`mt-5 flex-1 space-y-2 text-sm ${featured ? "text-ink-200" : "text-ink-600"}`}>
              <li className="flex gap-2">
                <span className={featured ? "text-accent-300" : "text-accent-600"}>✓</span>Mọi thứ trong gói Miễn phí
              </li>
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className={featured ? "text-accent-300" : "text-accent-600"}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/thanh-toan?goi=${plan.id}`}
              className={`mt-6 rounded-lg px-4 py-2 text-center text-sm font-medium ${
                featured ? "bg-white text-ink-900 hover:bg-ink-100" : "bg-ink-900 text-white hover:bg-ink-800"
              }`}
            >
              Chọn {plan.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
