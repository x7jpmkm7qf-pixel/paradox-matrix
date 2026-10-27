import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "The Paradox Matrix",
  description:
    "Dashboard tư duy xác suất cho chủ doanh nghiệp: giả lập quyết định Bayes, kiểm toán nghịch lý Simpson và mô phỏng tăng trưởng hàm mũ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
