import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ProProvider } from "@/components/pro/ProProvider";
import { MetaPixel } from "@/components/site/MetaPixel";
import { SITE } from "@/lib/site";
import "./globals.css";

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "The Paradox Matrix · Nền tảng ra quyết định bằng con số",
  description:
    "Nền tảng giúp chủ doanh nghiệp Việt ra quyết định bằng con số: đang đổ tiền vào thứ lỗ? Báo cáo đang đánh lừa bạn? Nhập số liệu, 5 phút biết ngay. Dùng thử miễn phí.",
  openGraph: {
    title: "The Paradox Matrix · Nền tảng ra quyết định bằng con số",
    description:
      "Nền tảng ra quyết định cho chủ doanh nghiệp. 3 cái bẫy khiến chủ doanh nghiệp mất tiền nhiều nhất. Nhập số liệu của bạn, 5 phút biết mình có đang mắc bẫy không.",
    locale: "vi_VN",
    type: "website",
    siteName: "The Paradox Matrix",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <ProProvider>{children}</ProProvider>
        <MetaPixel />
      </body>
    </html>
  );
}
