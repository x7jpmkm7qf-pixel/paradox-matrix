export type PlanId = "pro-6m" | "pro-month" | "pro-year" | "founder";

export interface Plan {
  id: PlanId;
  /** One-letter tag embedded in order codes so the amount can be recovered without a database. */
  tag: "S" | "P" | "Y" | "F" | "G";
  name: string;
  price: number;
  /** License length in days; null means lifetime. */
  days: number | null;
  period: string;
  note: string;
  /** Plan the perks build on ("Mọi thứ trong gói …"). */
  includes: string;
  perks: string[];
  /** Headline perk shown in its own box above the list. */
  highlight?: { title: string; body: string };
  badge?: string;
}

/**
 * Prices must not equal any price sold on tamlyhocvn.club: both shops share one bank account,
 * and that site's SePay webhook auto-matches code-less transfers to its pending orders by exact amount.
 */
const PRO_PERKS = [
  "Xem kết luận không giới hạn với số liệu của bạn",
  "Nhập và xuất bảng số liệu (Excel, Google Sheets)",
  "Xuất báo cáo PDF gửi đối tác, nhà đầu tư",
  "Hỗ trợ qua Zalo trong giờ hành chính",
];

export const PLANS: Plan[] = [
  {
    id: "pro-6m",
    tag: "S",
    name: "Pro 6 tháng",
    price: 678_000,
    days: 183,
    period: "/6 tháng",
    note: "≈ 113.000đ/tháng, không tự gia hạn",
    includes: "Mọi thứ trong gói Miễn phí",
    perks: PRO_PERKS,
  },
  {
    id: "pro-year",
    tag: "Y",
    name: "Pro năm",
    price: 1_249_000,
    days: 366,
    period: "/năm",
    note: "≈ 104.000đ/tháng, rẻ hơn 2 gói 6 tháng 107.000đ",
    includes: "Mọi thứ trong Pro 6 tháng",
    highlight: {
      title: "Có người cùng bạn soi số",
      body: "Mỗi quý 1 buổi 1:1 (30 phút) với huấn luyện viên, cùng bạn soi một quyết định thật trước khi xuống tiền.",
    },
    perks: [
      "Hỗ trợ Zalo ưu tiên, trả lời trong 4 giờ",
      "Dùng trước mọi công cụ mới, trước gói 6 tháng",
      "Giữ nguyên giá 1.249.000đ khi gia hạn năm sau",
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
    note: "Rẻ hơn 2 năm Pro, dùng mãi mãi",
    includes: "Mọi thứ trong Pro năm",
    highlight: {
      title: "Zalo trực tiếp với anh Sơn",
      body: "Nối thẳng với người sáng lập, cũng là người xây nền tảng. Sắp ra quyết định lớn, bạn nhắn để được cố vấn trực tiếp, không qua trung gian.",
    },
    perks: [
      "Huấn luyện viên 1:1 mỗi tháng (30 phút) trong 12 tháng đầu",
      "Đặt hàng công cụ: bạn nêu bài toán đang gặp, chúng tôi ưu tiên xây",
      "Nhóm Zalo riêng của 100 thành viên sáng lập",
      "Mọi công cụ mới trên nền tảng, trọn đời không trả thêm",
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

/**
 * Retired plans, no longer sold. Kept so their order codes (tag P) and licenses still verify,
 * and earlier buyers keep what they paid for.
 */
const RETIRED: Plan[] = [
  {
    id: "pro-month",
    tag: "P",
    name: "Pro tháng",
    price: 149_900,
    days: 31,
    period: "/tháng",
    note: "",
    includes: "Mọi thứ trong gói Miễn phí",
    perks: PRO_PERKS,
  },
];

/** Plans on sale, for checkout. */
export const findPlan = (id: string | null | undefined) => PLANS.find((p) => p.id === id);
/** Any plan ever sold, for showing and verifying existing orders and licenses. */
export const findAnyPlan = (id: string | null | undefined) => [...PLANS, ...RETIRED].find((p) => p.id === id);
export const planByTag = (tag: string) => [...PLANS, FOUNDER_LATE, ...RETIRED].find((p) => p.tag === tag);

export const vnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

export const FREE_FEATURES = [
  "Vào nền tảng với cả 3 công cụ: Tiếc tiền, Báo cáo đánh lừa, Bỏ cuộc quá sớm",
  "Dữ liệu mẫu theo ngành, xem thoải mái",
  "3 lượt xem kết luận với số liệu của bạn (cần tạo tài khoản miễn phí)",
];
