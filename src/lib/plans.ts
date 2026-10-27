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
  /** Plan the perks build on ("Mọi thứ trong gói …"). */
  includes: string;
  perks: string[];
  badge?: string;
}

/**
 * Prices must not equal any price sold on tamlyhocvn.club: both shops share one bank account,
 * and that site's SePay webhook auto-matches code-less transfers to its pending orders by exact amount.
 */
export const PLANS: Plan[] = [
  {
    id: "pro-month",
    tag: "P",
    name: "Pro tháng",
    price: 149_900,
    days: 31,
    period: "/tháng",
    note: "Linh hoạt, không tự gia hạn",
    includes: "Mọi thứ trong gói Miễn phí",
    perks: [
      "Nhập và xuất bảng số liệu (Excel, Google Sheets)",
      "Xuất báo cáo PDF gửi đối tác, nhà đầu tư",
      "Hỗ trợ qua Zalo trong giờ hành chính",
    ],
  },
  {
    id: "pro-year",
    tag: "Y",
    name: "Pro năm",
    price: 1_249_000,
    days: 366,
    period: "/năm",
    note: "≈ 104.000đ/tháng, rẻ hơn trả tháng 549.000đ",
    includes: "Mọi thứ trong Pro tháng",
    perks: [
      "1 buổi 1:1 với huấn luyện viên mỗi quý (30 phút): cùng bạn soi một quyết định thật",
      "Hỗ trợ Zalo ưu tiên, trả lời trong 4 giờ",
      "Được dùng trước các công cụ mới",
    ],
    badge: "Phổ biến nhất",
  },
  {
    id: "founder",
    tag: "F",
    name: "Sáng lập",
    price: 1_999_000,
    days: null,
    period: "trọn đời",
    note: "Bằng 16 tháng Pro, dùng mãi mãi",
    includes: "Mọi thứ trong Pro năm",
    perks: [
      "Huấn luyện viên 1:1 mỗi tháng (30 phút) trong 12 tháng đầu",
      "Nhóm Zalo riêng của 100 thành viên sáng lập",
      "Mọi công cụ ra sau này, trọn đời không trả thêm",
      "Giá giữ nguyên mãi mãi, không phí gia hạn",
    ],
    badge: "Chỉ 100 suất",
  },
];

export const findPlan = (id: string | null | undefined) => PLANS.find((p) => p.id === id);
export const planByTag = (tag: string) => PLANS.find((p) => p.tag === tag);

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export const FREE_FEATURES = [
  "Cả 3 công cụ: Tiếc tiền, Báo cáo đánh lừa, Bỏ cuộc quá sớm",
  "Dữ liệu mẫu theo ngành",
  "Nhập tay không giới hạn",
];
