import { NextResponse } from "next/server";
import { claimLicense, loadAccount } from "@/lib/account";
import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ERRORS = {
  invalid: "Mã không hợp lệ hoặc đã hết hạn.",
  taken: "Mã đơn này đã gắn với một tài khoản khác. Nhắn Zalo hỗ trợ nếu đó là đơn của bạn.",
};

/** Moves a paid license (from checkout, an order code, or an old browser-only activation) onto the account. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.email) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  const { license } = (await req.json().catch(() => ({}))) as { license?: string };
  const result = await claimLicense(user.id, String(license ?? ""));
  if (result !== "ok") return NextResponse.json({ error: ERRORS[result], reason: result }, { status: 409 });
  return NextResponse.json({ account: await loadAccount(user.id, user.email) });
}
