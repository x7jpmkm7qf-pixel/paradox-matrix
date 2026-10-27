import "server-only";
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { planByTag, type Plan } from "./plans";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Signing key: LICENSE_SECRET when set, otherwise derived from the SePay token so the
 * shop works with a single secret. Changing whichever is used invalidates issued licenses
 * (order codes can still be re-activated while SePay lists the payment).
 */
function secret(): string {
  if (process.env.LICENSE_SECRET) return process.env.LICENSE_SECRET;
  if (process.env.SEPAY_API_TOKEN) {
    return createHash("sha256").update(`paradox-license:${process.env.SEPAY_API_TOKEN}`).digest("hex");
  }
  if (process.env.NODE_ENV !== "production") return "dev-only-secret";
  throw new Error("LICENSE_SECRET is not set");
}

const hmac = (data: string) => createHmac("sha256", secret()).update(data).digest();

function checksum(body: string): string {
  const digest = hmac(`order:${body}`);
  return Array.from(digest.subarray(0, 3), (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * Order codes are self-describing: PM + plan tag + 6 random chars + 3-char checksum.
 * The plan (and so the amount) is recovered from the code, which keeps checkout stateless.
 */
export function createOrderCode(plan: Plan): string {
  let rand = "";
  for (let i = 0; i < 6; i++) rand += ALPHABET[randomInt(ALPHABET.length)];
  const body = `PM${plan.tag}${rand}`;
  return body + checksum(body);
}

export function parseOrderCode(raw: string): Plan | null {
  const code = raw.trim().toUpperCase();
  if (!/^PM[A-Z][A-Z0-9]{9}$/.test(code)) return null;
  const body = code.slice(0, 9);
  if (checksum(body) !== code.slice(9)) return null;
  return planByTag(code[2]) ?? null;
}

export interface LicensePayload {
  /** Order code the license was issued for. */
  c: string;
  /** Plan id. */
  p: string;
  /** Issued-at, epoch ms. */
  i: number;
  /** Expiry, epoch ms; 0 means lifetime. */
  e: number;
}

const b64url = (buf: Buffer) => buf.toString("base64url");

export function issueLicense(code: string, plan: Plan, paidAt: number): string {
  const payload: LicensePayload = {
    c: code,
    p: plan.id,
    i: paidAt,
    e: plan.days === null ? 0 : paidAt + plan.days * 86_400_000,
  };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  return `PMX.${body}.${b64url(hmac(`license:${body}`))}`;
}

export function verifyLicense(token: string): LicensePayload | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "PMX") return null;
  const [, body, sig] = parts;
  const expected = hmac(`license:${body}`);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as LicensePayload;
  } catch {
    return null;
  }
}
