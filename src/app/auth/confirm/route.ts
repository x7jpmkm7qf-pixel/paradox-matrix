import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeNext } from "@/lib/accounts";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Landing for links in our emails: verifies the token, signs the visitor in, then forwards them. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(url.searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const dest = new URL(next, url.origin);
      if (type !== "recovery") dest.searchParams.set("chao", "1");
      return NextResponse.redirect(dest);
    }
  }
  return NextResponse.redirect(new URL("/dang-nhap?loi=link", url.origin));
}
