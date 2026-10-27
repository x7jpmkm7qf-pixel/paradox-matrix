import { NextResponse } from "next/server";
import { verifyLicense } from "@/lib/license";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { license } = (await req.json().catch(() => ({}))) as { license?: string };
  const payload = license ? verifyLicense(license) : null;
  if (!payload) return NextResponse.json({ valid: false });
  const active = payload.e === 0 || payload.e > Date.now();
  return NextResponse.json({ valid: active, plan: payload.p, expiresAt: payload.e || null, code: payload.c });
}
