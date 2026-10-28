import { NextResponse } from "next/server";
import { markLeadDone } from "@/lib/account";
import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Remembers that the Zalo prompt was answered or skipped, so it is not shown again on other devices. */
export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  await markLeadDone(user.id);
  return NextResponse.json({ ok: true });
}
