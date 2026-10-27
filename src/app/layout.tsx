import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ProProvider } from "@/components/pro/ProProvider";
import { MetaPixel } from "@/components/site/MetaPixel";
import "./globals.css";

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "The Paradox Matrix · Ra quyết định tốt hơn trực giác",
  description:
    "Công cụ tư duy xác suất cho chủ doanh nghiệp: giả lập quyết định Bayes, kiểm toán nghịch lý Simpson và mô phỏng tăng trưởng hàm mũ. Dùng thử miễn phí.",
  openGraph: {
    title: "The Paradox Matrix · Ra quyết định tốt hơn trực giác",
    description: "3 nghịch lý khiến chủ doanh nghiệp mất tiền nhiều nhất, biến thành công cụ bạn thử được với số liệu của chính mình.",
    locale: "vi_VN",
    type: "website",
  },
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
