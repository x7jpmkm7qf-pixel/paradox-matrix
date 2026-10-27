import { NextResponse } from "next/server";
import { findPlan } from "@/lib/plans";
import { createOrderCode } from "@/lib/license";
import { BANK, paymentConfigured } from "@/lib/sepay";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { plan: planId } = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = findPlan(planId);
  if (!plan) return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
  if (!paymentConfigured()) {
    return NextResponse.json({ error: "Thanh toán đang được cấu hình, vui lòng quay lại sau ít phút." }, { status: 503 });
  }

  const code = createOrderCode(plan);
  const { id: bankId, account, accountName } = BANK;
  const qs = new URLSearchParams({ amount: String(plan.price), addInfo: code, accountName });

  return NextResponse.json({
    code,
    plan: plan.id,
    amount: plan.price,
    bank: { id: bankId, account, accountName },
    qrUrl: `https://img.vietqr.io/image/${bankId}-${account}-compact2.png?${qs}`,
  });
}
