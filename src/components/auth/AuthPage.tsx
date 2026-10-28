import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ACCOUNTS_ON, safeNext } from "@/lib/accounts";
import { AuthPanel, type AuthMode } from "./AuthPanel";

const LINK_ERROR = "Đường dẫn trong email đã hết hạn hoặc đã được dùng. Bạn đăng nhập lại, hoặc yêu cầu gửi lại.";

export async function AuthPage({ mode, searchParams }: { mode: AuthMode; searchParams: Promise<Record<string, string | undefined>> }) {
  if (!ACCOUNTS_ON) notFound();
  const params = await searchParams;
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
        {params.loi === "link" && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{LINK_ERROR}</p>}
        <div className="rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
          <AuthPanel mode={mode} next={safeNext(params.next)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
