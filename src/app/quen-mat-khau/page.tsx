import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Quên mật khẩu · The Paradox Matrix", robots: { index: false } };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <AuthPage mode="forgot" searchParams={searchParams} />;
}
