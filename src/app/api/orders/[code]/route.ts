import { NextResponse } from "next/server";
import { issueLicense, parseOrderCode } from "@/lib/license";
import { findPayment } from "@/lib/sepay";
import { notifyTelegram, sendCapiPurchase } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Per-instance memory so a client that keeps polling after payment does not re-notify.
const announced = new Set<string>();

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = raw.trim().toUpperCase();
  const plan = parseOrderCode(code);
  if (!plan) return NextResponse.json({ error: "Mã đơn không hợp lệ" }, { status: 404 });

  let payment;
  try {
    payment = await findPayment(code, plan.price);
  } catch {
    return NextResponse.json({ status: "pending", retry: true });
  }
  if (!payment) return NextResponse.json({ status: "pending" });

  const license = issueLicense(code, plan, payment.paidAt);
  const url = new URL(req.url);

  // Only the live checkout page asks for announcements; restoring an old order stays silent.
  if (url.searchParams.get("live") === "1" && !announced.has(code) && Date.now() - payment.paidAt < 6 * 3_600_000) {
    announced.add(code);
    const cookies = req.headers.get("cookie") ?? "";
    const cookie = (name: string) => cookies.match(new RegExp(`(?:^|; )${name}=([^;]+)`))?.[1] ?? null;
    await Promise.all([
      notifyTelegram(code, plan, payment.amount),
      sendCapiPurchase({
        code,
        amount: plan.price,
        plan,
        url: `${url.origin}/thanh-toan`,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        ua: req.headers.get("user-agent"),
        fbp: cookie("_fbp"),
        fbc: cookie("_fbc"),
      }),
    ]);
  }

  return NextResponse.json({ status: "paid", plan: plan.id, license });
}
