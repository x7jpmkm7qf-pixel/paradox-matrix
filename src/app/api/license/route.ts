import { NextResponse } from "next/server";
import { verifyLicense } from "@/lib/license";

export const dynamic = "force-dynamic";

/** Founder-only Zalo group; served only to valid founder licenses so the link stays out of the public bundle. */
const FOUNDER_GROUP = process.env.FOUNDER_ZALO_GROUP_URL || "https://zalo.me/g/tet5i5a0matf9i72bcqv";

export async function POST(req: Request) {
  const { license } = (await req.json().catch(() => ({}))) as { license?: string };
  const payload = license ? verifyLicense(license) : null;
  if (!payload) return NextResponse.json({ valid: false });
  const active = payload.e === 0 || payload.e > Date.now();
  return NextResponse.json({
    valid: active,
    plan: payload.p,
    expiresAt: payload.e || null,
    code: payload.c,
    founderGroup: active && payload.p === "founder" ? FOUNDER_GROUP : null,
  });
}
