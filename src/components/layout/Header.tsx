import Link from "next/link";
import { ProBadge } from "@/components/pro/ProBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 print:hidden">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden text-sm font-semibold tracking-tight text-ink-900 sm:inline">The Paradox Matrix</span>
        </Link>
        <nav className="flex items-center gap-1 whitespace-nowrap text-sm sm:gap-2">
          <Link href="/app" className="rounded-lg px-2.5 py-1.5 text-ink-600 hover:bg-ink-100 hover:text-ink-900">
            Dùng thử
          </Link>
          <Link
            href="/hieu-them"
            className="hidden rounded-lg px-2.5 py-1.5 text-ink-600 hover:bg-ink-100 hover:text-ink-900 md:inline-block"
          >
            Hiểu thêm
          </Link>
          <Link
            href="/ve-chung-toi"
            className="hidden rounded-lg px-2.5 py-1.5 text-ink-600 hover:bg-ink-100 hover:text-ink-900 md:inline-block"
          >
            Về chúng tôi
          </Link>
          <Link href="/bang-gia" className="rounded-lg px-2.5 py-1.5 text-ink-600 hover:bg-ink-100 hover:text-ink-900">
            Bảng giá
          </Link>
          <ProBadge />
        </nav>
      </div>
    </header>
  );
}

export function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#18181b" />
      <rect x="5" y="5" width="6" height="6" rx="1.5" fill="#fff" />
      <rect x="13" y="5" width="6" height="6" rx="1.5" fill="#3b6cf6" />
      <rect x="5" y="13" width="6" height="6" rx="1.5" fill="#3b6cf6" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#fff" />
    </svg>
  );
}
