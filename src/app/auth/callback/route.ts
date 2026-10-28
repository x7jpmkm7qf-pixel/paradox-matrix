import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/accounts";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Return leg of "Tiếp tục với Google": swaps the code for a session, then hands back to the page that started it. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  if (code) {
    const { data, error } = await (await supabaseServer()).auth.exchangeCodeForSession(code);
    if (!error) {
      // A brand-new account (not a returning sign-in) counts as a registration for ad tracking.
      const created = Date.parse(data.user?.created_at ?? "");
      const isNew = Date.now() - created < 5 * 60_000;
      const params = new URLSearchParams({ next, ...(isNew ? { moi: "1" } : {}) });
      return NextResponse.redirect(new URL(`/auth/xong?${params}`, url.origin));
    }
    console.error("oauth", error.message);
  }
  return NextResponse.redirect(new URL("/dang-nhap?loi=google", url.origin));
}
