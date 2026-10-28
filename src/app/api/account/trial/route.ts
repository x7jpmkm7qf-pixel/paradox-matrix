import { NextResponse } from "next/server";
import { spendTrial } from "@/lib/account";
import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TOOLS = new Set(["sunk-cost", "simpson", "growth"]);

/** Spends one free verdict. Only a hash of the inputs is sent, so the numbers themselves never leave the browser. */
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  const { tool, hash } = (await req.json().catch(() => ({}))) as { tool?: string; hash?: string };
  if (!TOOLS.has(String(tool)) || !/^[a-f0-9]{64}$/.test(String(hash))) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }
  return NextResponse.json({ trial: await spendTrial(user.id, tool!, hash!) });
}
