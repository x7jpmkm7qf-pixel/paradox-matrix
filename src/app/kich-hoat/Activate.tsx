"use client";

import { useState } from "react";
import Link from "next/link";
import { usePro } from "@/components/pro/ProProvider";
import { findPlan } from "@/lib/plans";

export function Activate() {
  const { isPro, plan, expiresAt, activate, deactivate } = usePro();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "notfound" | "invalid">("idle");

  const submit = async () => {
    const value = input.trim();
    if (!value) return;
    setStatus("checking");
    if (value.startsWith("PMX.")) {
      setStatus((await activate(value)) ? "idle" : "invalid");
      return;
    }
    const res = await fetch(`/api/orders/${encodeURIComponent(value.toUpperCase())}`, { cache: "no-store" });
    if (res.status === 404) return setStatus("invalid");
    const data = await res.json();
    if (data.status === "paid" && data.license) {
      setStatus((await activate(data.license)) ? "idle" : "invalid");
    } else {
      setStatus("notfound");
    }
  };

  if (isPro) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-ink-900">Máy này đang dùng Pro</h1>
        <p className="mt-2 text-sm text-ink-600">
          Gói: {findPlan(plan)?.name ?? plan} ·{" "}
          {expiresAt ? `hết hạn ngày ${new Date(expiresAt).toLocaleDateString("vi-VN")}` : "trọn đời"}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/app" className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800">
            Vào dashboard
          </Link>
          <button type="button" onClick={deactivate} className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
            Gỡ Pro khỏi máy này
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
      <h1 className="text-2xl font-semibold text-ink-900">Kích hoạt hoặc khôi phục Pro</h1>
      <p className="mt-2 text-sm text-ink-600">Nhập mã đơn (dạng PM…) bạn nhận được sau khi thanh toán.</p>
      <div className="mt-5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="VD: PMYABC234XYZ"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-sm uppercase focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === "checking"}
          className="shrink-0 rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
        >
          {status === "checking" ? "Đang kiểm tra..." : "Kích hoạt"}
        </button>
      </div>
      {status === "invalid" && <p className="mt-3 text-sm text-red-600">Mã không hợp lệ hoặc đã hết hạn.</p>}
      {status === "notfound" && (
        <p className="mt-3 text-sm text-amber-700">
          Chưa thấy khoản thanh toán cho mã này. Nếu bạn vừa chuyển khoản, đợi 1–2 phút rồi thử lại, hoặc nhắn Zalo hỗ trợ ở cuối trang.
        </p>
      )}
      <p className="mt-6 text-xs text-ink-500">
        Chưa có Pro?{" "}
        <Link href="/bang-gia" className="underline">
          Xem bảng giá
        </Link>
      </p>
    </div>
  );
}
