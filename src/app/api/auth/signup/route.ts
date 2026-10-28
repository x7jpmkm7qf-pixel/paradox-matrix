import { NextResponse } from "next/server";
import { ACCOUNTS_ON, MIN_PASSWORD, safeNext } from "@/lib/accounts";
import { findUserByEmail } from "@/lib/account";
import { ensureSchema } from "@/lib/db";
import { sendConfirmEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, throttled } from "@/lib/throttle";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Creates an unconfirmed account (or refreshes one never confirmed) and emails the confirmation link.
 * The email carries a 6-digit code (typed in the same tab, so numbers already entered are kept) and a link.
 * Both are made with the admin API and sent by us, so the email is in Vietnamese and needs no Supabase mail setup.
 */
export async function POST(req: Request) {
  if (!ACCOUNTS_ON) return NextResponse.json({ error: "Chưa mở đăng ký." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as { email?: string; password?: string; next?: string };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Email chưa đúng." }, { status: 400 });
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json({ error: `Mật khẩu cần ít nhất ${MIN_PASSWORD} ký tự.` }, { status: 400 });
  }
  if (throttled(`signup:${clientIp(req)}`, 8, 3_600_000) || throttled(`signup:${email}`, 4, 3_600_000)) {
    return NextResponse.json({ error: "Bạn thử quá nhiều lần, đợi một lát rồi thử lại nhé." }, { status: 429 });
  }

  await ensureSchema();
  const admin = supabaseAdmin();
  const existing = await findUserByEmail(email);
  if (existing?.email_confirmed_at) {
    return NextResponse.json({ error: "Email này đã có tài khoản. Bạn đăng nhập nhé.", exists: true }, { status: 409 });
  }

  let props: { hashed_token: string; email_otp: string } | undefined;
  let type: "signup" | "magiclink" = "signup";
  if (existing) {
    // Signed up before but never confirmed: take the new password and send a fresh link.
    await admin.auth.admin.updateUserById(existing.id, { password });
    const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
    if (error) return failed(error);
    props = data.properties;
    type = "magiclink";
  } else {
    const { data, error } = await admin.auth.admin.generateLink({ type: "signup", email, password });
    if (error) return failed(error);
    props = data.properties;
  }
  if (!props?.hashed_token) return failed(new Error("no token"));

  const origin = new URL(req.url).origin;
  const link = `${origin}/auth/confirm?${new URLSearchParams({ token_hash: props.hashed_token, type, next: safeNext(body.next) })}`;
  try {
    await sendConfirmEmail(email, props.email_otp, link);
  } catch (e) {
    return failed(e);
  }
  // The browser verifies the 6-digit code itself, so it needs to know which kind of token was issued.
  return NextResponse.json({ ok: true, type });
}

function failed(e: unknown) {
  console.error("signup", e);
  return NextResponse.json({ error: "Chưa gửi được email xác nhận, bạn thử lại sau ít phút." }, { status: 500 });
}
