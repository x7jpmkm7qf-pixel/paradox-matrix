export type PlanId = "pro-month" | "pro-year" | "founder";

export interface Plan {
  id: PlanId;
  /** One-letter tag embedded in order codes so the amount can be recovered without a database. */
  tag: "P" | "Y" | "F" | "G";
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
      "Xem kết luận không giới hạn với số liệu của bạn",
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

/** Founder seats: the first FOUNDER_EARLY_SEATS sell at the base price, the rest at FOUNDER_LATE.price. */
export const FOUNDER_SEATS = 100;
export const FOUNDER_EARLY_SEATS = 30;

const founderEarly = PLANS.find((p) => p.id === "founder")!;

/** Same plan once the early seats are gone; its own tag keeps the higher price checkable from the order code. */
export const FOUNDER_LATE: Plan = { ...founderEarly, tag: "G", price: 2_499_000, note: "Bằng 2 năm Pro, dùng mãi mãi" };

export interface FounderOffer {
  plan: Plan;
  /** Founder seats paid so far; null when SePay could not be read. */
  sold: number | null;
  seatsLeft: number | null;
  earlyLeft: number | null;
  soldOut: boolean;
}

/** Current founder price and seats; an unknown count falls back to the early price without a counter. */
export function founderOffer(sold: number | null): FounderOffer {
  if (sold === null) return { plan: founderEarly, sold, seatsLeft: null, earlyLeft: null, soldOut: false };
  const earlyLeft = Math.max(0, FOUNDER_EARLY_SEATS - sold);
  const seatsLeft = Math.max(0, FOUNDER_SEATS - sold);
  return { plan: earlyLeft > 0 ? founderEarly : FOUNDER_LATE, sold, seatsLeft, earlyLeft, soldOut: seatsLeft === 0 };
}

/** PLANS with the founder entry priced for the current offer. */
export const plansFor = (offer: FounderOffer) => PLANS.map((p) => (p.id === "founder" ? offer.plan : p));

export const findPlan = (id: string | null | undefined) => PLANS.find((p) => p.id === id);
export const planByTag = (tag: string) => [...PLANS, FOUNDER_LATE].find((p) => p.tag === tag);

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export const FREE_FEATURES = [
  "Cả 3 công cụ: Tiếc tiền, Báo cáo đánh lừa, Bỏ cuộc quá sớm",
  "Dữ liệu mẫu theo ngành, xem thoải mái",
  "3 lượt xem kết luận với số liệu của bạn",
];
