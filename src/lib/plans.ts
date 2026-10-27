export type PlanId = "pro-month" | "pro-year" | "founder";

export interface Plan {
  id: PlanId;
  /** One-letter tag embedded in order codes so the amount can be recovered without a database. */
  tag: "P" | "Y" | "F";
  name: string;
  price: number;
  /** License length in days; null means lifetime. */
  days: number | null;
  period: string;
  note: string;
}

/**
 * Prices must not equal any price sold on tamlyhocvn.club: both shops share one bank account,
 * and that site's SePay webhook auto-matches code-less transfers to its pending orders by exact amount.
 */
export const PLANS: Plan[] = [
  { id: "pro-month", tag: "P", name: "Pro tháng", price: 149_900, days: 31, period: "/tháng", note: "Linh hoạt, không tự gia hạn" },
  { id: "pro-year", tag: "Y", name: "Pro năm", price: 1_249_000, days: 366, period: "/năm", note: "≈ 104.000đ/tháng, tiết kiệm 30%" },
  { id: "founder", tag: "F", name: "Sáng lập", price: 1_999_000, days: null, period: "trọn đời", note: "Chỉ 100 suất đầu tiên" },
];

export const findPlan = (id: string | null | undefined) => PLANS.find((p) => p.id === id);
export const planByTag = (tag: string) => PLANS.find((p) => p.tag === tag);

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export const FREE_FEATURES = [
  "Cả 3 công cụ: Tiếc tiền, Báo cáo đánh lừa, Bỏ cuộc quá sớm",
  "Dữ liệu mẫu theo ngành",
  "Nhập tay không giới hạn",
];

export const PRO_FEATURES = [
  "Nhập và xuất bảng số liệu (Excel, Google Sheets)",
  "Xuất báo cáo PDF để gửi đối tác, nhà đầu tư",
  "Ưu tiên các module và mẫu mới",
  "Hỗ trợ trực tiếp qua Zalo",
];
