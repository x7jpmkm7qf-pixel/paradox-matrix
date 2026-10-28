import { NextResponse } from "next/server";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { findUserByEmail } from "@/lib/account";
import { sendResetEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, throttled } from "@/lib/throttle";

export const dynamic = "force-dynamic";

/** Emails a password reset link. Always answers ok so the form does not reveal which emails have accounts. */
export async function POST(req: Request) {
  if (!ACCOUNTS_ON) return NextResponse.json({ error: "Chưa mở đăng ký." }, { status: 503 });
  const { email: raw } = (await req.json().catch(() => ({}))) as { email?: string };
  const email = String(raw ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Bạn nhập email nhé." }, { status: 400 });
  if (throttled(`recover:${clientIp(req)}`, 8, 3_600_000) || throttled(`recover:${email}`, 3, 3_600_000)) {
    return NextResponse.json({ error: "Bạn thử quá nhiều lần, đợi một lát rồi thử lại nhé." }, { status: 429 });
  }

  try {
    const user = await findUserByEmail(email);
    if (user?.email_confirmed_at) {
      const { data, error } = await supabaseAdmin().auth.admin.generateLink({ type: "recovery", email });
      if (error) throw error;
      const params = new URLSearchParams({ token_hash: data.properties.hashed_token, type: "recovery", next: "/dat-lai-mat-khau" });
      await sendResetEmail(email, `${new URL(req.url).origin}/auth/confirm?${params}`);
    }
  } catch (e) {
    console.error("recover", e);
    return NextResponse.json({ error: "Chưa gửi được email, bạn thử lại sau ít phút." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
