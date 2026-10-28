import { NextResponse } from "next/server";
import { ACCOUNTS_ON } from "@/lib/accounts";
import { loadAccount } from "@/lib/account";
import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** The signed-in visitor's plan and free verdicts; { account: null } when signed out. */
export async function GET() {
  if (!ACCOUNTS_ON) return NextResponse.json({ account: null });
  const user = await currentUser();
  if (!user?.email) return NextResponse.json({ account: null });
  return NextResponse.json({ account: await loadAccount(user.id, user.email) });
}
