import { NextResponse } from "next/server";
import { notifyLead } from "@/lib/notify";

export const dynamic = "force-dynamic";

const TOOLS: Record<string, string> = {
  "sunk-cost": "Có nên chi tiếp hay dừng?",
  simpson: "Báo cáo có đang đánh lừa bạn?",
  growth: "Bỏ hay trụ?",
};

/** Vietnamese mobile number: 0xxxxxxxxx or +84xxxxxxxxx, spaces and dots ignored. */
function normalisePhone(raw: string) {
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^\+?84/, "0");
  return /^0[35789]\d{8}$/.test(digits) ? digits : null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { phone?: string; tool?: string; summary?: string };
  const phone = normalisePhone(String(body.phone ?? ""));
  const tool = TOOLS[String(body.tool)];
  if (!phone || !tool) return NextResponse.json({ ok: false }, { status: 400 });
  await notifyLead(phone, tool, String(body.summary ?? "").slice(0, 300));
  return NextResponse.json({ ok: true });
}
