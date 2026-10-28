import "server-only";
import { SITE } from "./site";

const FROM = process.env.MAIL_FROM || `${SITE.name} <no-reply@tamlyhocvn.club>`;

/** Sends one email through Resend; in local dev without a key the link is printed instead. */
async function send(to: string, subject: string, html: string, link: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") return console.log(`[mail] ${to}: ${subject}\n${link}`);
    throw new Error("RESEND_API_KEY is not set");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html, reply_to: SITE.email }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

const layout = (title: string, body: string, button: string, link: string, code?: string) => `<!doctype html>
<html lang="vi"><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b">
<div style="max-width:480px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #e4e4e7">
    <p style="margin:0 0 20px;font-size:14px;font-weight:bold">${SITE.name}</p>
    <h1 style="margin:0 0 12px;font-size:20px">${title}</h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#3f3f46">${body}</p>${
      code
        ? `<p style="margin:0 0 8px;font-size:13px;color:#52525b">Mã xác nhận của bạn:</p>
    <p style="margin:0 0 24px;font-size:30px;font-weight:bold;letter-spacing:8px;font-family:monospace">${code}</p>
    <p style="margin:0 0 12px;font-size:13px;color:#52525b">Hoặc bấm nút:</p>`
        : ""
    }
    <a href="${link}" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:12px">${button}</a>
    <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#71717a">Nút không bấm được? Dán đường dẫn này vào trình duyệt:<br><span style="word-break:break-all">${link}</span></p>
  </div>
  <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#71717a;text-align:center">Không phải bạn yêu cầu? Cứ bỏ qua email này.<br>Hỗ trợ Zalo ${SITE.zaloDisplay}</p>
</div></body></html>`;

export const sendConfirmEmail = (to: string, code: string, link: string) =>
  send(
    to,
    `${code} là mã xác nhận Paradox Matrix của bạn`,
    layout(
      "Còn một bước nữa thôi",
      "Nhập mã dưới đây vào trang đang mở để xác nhận email và bắt đầu dùng The Paradox Matrix. Mã có hiệu lực trong 1 giờ.",
      "Xác nhận email",
      link,
      code,
    ),
    link,
  );

export const sendResetEmail = (to: string, link: string) =>
  send(
    to,
    "Đặt lại mật khẩu Paradox Matrix",
    layout(
      "Đặt lại mật khẩu",
      "Bạn vừa yêu cầu đặt lại mật khẩu. Bấm nút dưới đây để chọn mật khẩu mới. Đường dẫn có hiệu lực trong 1 giờ.",
      "Đặt mật khẩu mới",
      link,
    ),
    link,
  );
