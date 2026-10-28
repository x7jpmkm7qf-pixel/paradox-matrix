import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Tạo tài khoản · The Paradox Matrix", robots: { index: false } };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <AuthPage mode="signup" searchParams={searchParams} />;
}
