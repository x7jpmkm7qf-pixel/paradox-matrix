"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { useSearchParams } from "next/navigation";
import { vnd, type Plan, type PlanId } from "@/lib/plans";
import { usePro } from "@/components/pro/ProProvider";
import { track } from "@/lib/pixel";

interface Order {
  code: string;
  plan: PlanId;
  amount: number;
  qrUrl: string;
  bank: { id: string; account: string; accountName: string };
  createdAt: number;
}

const PENDING_KEY = "pm_pending_order";
const POLL_MS = 4_000;
const POLL_LIMIT_MS = 30 * 60_000;

const loadPending = (): Order | null => {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const order = raw ? (JSON.parse(raw) as Order) : null;
    return order && Date.now() - order.createdAt < 24 * 3_600_000 ? order : null;
  } catch {
    return null;
  }
};

const savePending = (order: Order | null) => {
  try {
    if (order) localStorage.setItem(PENDING_KEY, JSON.stringify(order));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
};

export function Checkout({ plans }: { plans: Plan[] }) {
  const params = useSearchParams();
  const findPlan = (id: string | null | undefined) => plans.find((p) => p.id === id);
  const { activate } = usePro();
  const [planId, setPlanId] = useState<PlanId>(() => findPlan(params.get("goi"))?.id ?? "pro-year");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState<{ license: string; code: string } | null>(null);
  const [expired, setExpired] = useState(false);
  const pollStart = useRef(0);

  useEffect(() => {
    const pending = loadPending();
    if (pending && (!params.get("goi") || pending.plan === params.get("goi"))) {
      setOrder(pending);
      setPlanId(pending.plan);
    }
  }, [params]);

  const createOrder = useCallback(
    async (id: PlanId) => {
      setLoading(true);
      setError(null);
      setExpired(false);
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Không tạo được đơn hàng");
        const next: Order = { ...data, createdAt: Date.now() };
        setOrder(next);
        savePending(next);
        const name = plans.find((p) => p.id === id)?.name;
        track("InitiateCheckout", { currency: "VND", value: next.amount, content_name: name, content_ids: [id] });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [plans],
  );

  useEffect(() => {
    if (!order || paid || expired) return;
    pollStart.current = Date.now();
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      if (Date.now() - pollStart.current > POLL_LIMIT_MS) return setExpired(true);
      try {
        const res = await fetch(`/api/orders/${order.code}?live=1`, { cache: "no-store" });
        const data = await res.json();
        if (data.status === "paid" && data.license) {
          stopped = true;
          await activate(data.license);
          savePending(null);
          setPaid({ license: data.license, code: order.code });
          track("Purchase", { currency: "VND", value: order.amount, content_ids: [order.plan] }, order.code);
          return;
        }
      } catch {
        // network hiccup: keep polling
      }
      if (!stopped) timer = setTimeout(tick, POLL_MS);
    };
    let timer = setTimeout(tick, POLL_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [order, paid, expired, activate]);

  // A restored founder order can outlive the plan being on sale; fall back so the page still renders.
  const plan = findPlan(planId) ?? plans[0];

  if (paid) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-card">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink-900">Đã nhận thanh toán. Pro đã được mở khóa!</h1>
        <p className="mt-2 text-sm text-ink-600">Máy này đã được kích hoạt. Hãy lưu mã đơn dưới đây để kích hoạt trên máy khác.</p>
        <div className="mx-auto mt-5 max-w-sm rounded-xl bg-ink-50 p-4">
          <p className="text-xs text-ink-500">Mã đơn của bạn</p>
          <p className="mt-1 font-mono text-xl font-semibold tracking-wider text-ink-900">{paid.code}</p>
          <CopyButton text={paid.code} />
        </div>
        <Link href="/app" className="mt-6 inline-block rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800">
          Vào dùng Pro ngay
        </Link>
        <a
          href={SITE.guideUrl}
          download
          className="mt-3 block text-sm font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
        >
          Tải hướng dẫn sử dụng (PDF)
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <h1 className="text-xl font-semibold text-ink-900">Nâng cấp The Paradox Matrix Pro</h1>
        <p className="mt-1 text-sm text-ink-500">Chọn gói, quét QR, Pro mở khóa tự động.</p>
        <div className="mt-5 space-y-2">
          {plans.map((p) => (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                p.id === planId ? "border-ink-900 bg-ink-50" : "border-ink-200 hover:border-ink-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="plan"
                  className="accent-ink-900"
                  checked={p.id === planId}
                  onChange={() => {
                    setPlanId(p.id);
                    setOrder(null);
                    savePending(null);
                  }}
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{p.name}</span>
                  <span className="block text-xs text-ink-500">{p.note}</span>
                </span>
              </span>
              <span className="text-right text-sm font-semibold text-ink-900">
                {vnd(p.price)}
                <span className="block text-xs font-normal text-ink-500">{p.period}</span>
              </span>
            </label>
          ))}
        </div>
        <ul className="mt-5 space-y-1.5 text-xs text-ink-500">
          <li>✓ Hoàn tiền 100% trong 7 ngày nếu không hài lòng</li>
          <li>✓ Gói tháng và năm không tự gia hạn, không trừ tiền ngầm</li>
          <li>
            ✓ Đã thanh toán trước đó?{" "}
            <Link href="/kich-hoat" className="underline">
              Khôi phục Pro
            </Link>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        {!order ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-ink-600">Bạn chọn</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">
              {plan.name} · {vnd(plan.price)}
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={() => createOrder(planId)}
              className="mt-6 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-60"
            >
              {loading ? "Đang tạo mã..." : "Tạo mã QR thanh toán"}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={order.qrUrl} alt={`QR chuyển khoản ${vnd(order.amount)}`} className="h-64 w-64 rounded-xl border border-ink-100" />
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                {expired ? "Đã hết thời gian chờ." : "Đang chờ thanh toán, trang sẽ tự cập nhật..."}
              </p>
              {expired && (
                <button type="button" onClick={() => setExpired(false)} className="mt-2 text-sm font-medium text-accent-700 underline">
                  Tôi đã chuyển khoản, kiểm tra lại
                </button>
              )}
            </div>
            <dl className="mt-5 divide-y divide-ink-100 rounded-xl border border-ink-200 text-sm">
              <Row label="Ngân hàng" value={order.bank.id} />
              <Row label="Số tài khoản" value={order.bank.account} copy />
              <Row label="Chủ tài khoản" value={order.bank.accountName} />
              <Row label="Số tiền" value={vnd(order.amount)} copy={String(order.amount)} />
              <Row label="Nội dung" value={order.code} copy highlight />
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Quét QR bằng app ngân hàng bất kỳ, số tiền và nội dung đã điền sẵn. Nếu chuyển tay, hãy ghi đúng nội dung <b>{order.code}</b>{" "}
              để hệ thống tự nhận. Chủ tài khoản là pháp nhân vận hành dịch vụ của chúng tôi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, copy, highlight }: { label: string; value: string; copy?: boolean | string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <dt className="text-ink-500">{label}</dt>
      <dd className={`flex items-center gap-2 text-right font-medium ${highlight ? "font-mono text-accent-700" : "text-ink-900"}`}>
        {value}
        {copy && <CopyButton text={typeof copy === "string" ? copy : value} small />}
      </dd>
    </div>
  );
}

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      className={`rounded-md border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 ${small ? "px-1.5 py-0.5 text-[11px]" : "mt-2 px-3 py-1 text-xs"}`}
    >
      {done ? "Đã chép" : "Chép"}
    </button>
  );
}
