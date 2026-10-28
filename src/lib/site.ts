/** Seller and support details shown on every page (shared with tamlyhocvn.club). */
export const SITE = {
  name: "The Paradox Matrix",
  brand: "Tâm Lý Học VN",
  brandUrl: "https://www.tamlyhocvn.club",
  fanpageUrl: "https://www.facebook.com/1078618678671937",
  /** Canonical origin for metadata, sitemap and share images. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://paradox-matrix-lyart.vercel.app",
  operator: process.env.NEXT_PUBLIC_SELLER_NAME || "NORWAY PHARMATECH AS MEDICINE",
  zalo: process.env.NEXT_PUBLIC_SUPPORT_ZALO || "0377418438",
  zaloDisplay: process.env.NEXT_PUBLIC_SUPPORT_ZALO_DISPLAY || "0377 418 438",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@tamlyhocvn.club",
  /** Customer how-to PDF, served from public/. */
  guideUrl: "/huong-dan-su-dung.pdf",
};
