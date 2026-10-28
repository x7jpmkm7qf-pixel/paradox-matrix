/** Seller and support details shown on every page (shared with tamlyhocvn.club). */
export const SITE = {
  name: "The Paradox Matrix",
  brand: "Tâm Lý Học VN",
  brandUrl: "https://www.tamlyhocvn.club",
  operator: process.env.NEXT_PUBLIC_SELLER_NAME || "NORWAY PHARMATECH AS MEDICINE",
  zalo: process.env.NEXT_PUBLIC_SUPPORT_ZALO || "0377418438",
  zaloDisplay: process.env.NEXT_PUBLIC_SUPPORT_ZALO_DISPLAY || "0377 418 438",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@tamlyhocvn.club",
  /** Customer how-to PDF, served from public/. */
  guideUrl: "/huong-dan-su-dung.pdf",
};
