import "server-only";
import { createHash } from "node:crypto";
import type { Plan } from "./plans";

/** Reports a paid order to the owner's Telegram (same bot/chat as tamlyhocvn.club). */
export async function notifyTelegram(code: string, plan: Plan, amount: number): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || chats.length === 0) return;
  const text = `💰 <b>Paradox Matrix</b> +${amount.toLocaleString("vi-VN")}đ\nGói: ${plan.name}\nMã đơn: <code>${code}</code>`;
  await Promise.all(
    chats.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
      }).catch(() => undefined),
    ),
  );
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "2401396086990381";

const sha = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/** Server-side Purchase via Conversions API; event_id = order code so it dedupes with the browser pixel. */
export async function sendCapiPurchase(opts: {
  code: string;
  amount: number;
  plan: Plan;
  url: string;
  ip?: string | null;
  ua?: string | null;
  fbp?: string | null;
  fbc?: string | null;
}): Promise<void> {
  const token = process.env.FB_CAPI_ACCESS_TOKEN;
  if (!token) return;
  const user_data: Record<string, unknown> = { external_id: [sha(opts.code)] };
  if (opts.ip) user_data.client_ip_address = opts.ip;
  if (opts.ua) user_data.client_user_agent = opts.ua;
  if (opts.fbp) user_data.fbp = opts.fbp;
  if (opts.fbc) user_data.fbc = opts.fbc;
  await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.code,
          action_source: "website",
          event_source_url: opts.url,
          user_data,
          custom_data: { currency: "VND", value: opts.amount, content_name: `Paradox Matrix ${opts.plan.name}`, content_ids: [opts.plan.id] },
        },
      ],
    }),
  }).catch(() => undefined);
}
