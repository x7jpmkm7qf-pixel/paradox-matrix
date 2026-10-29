import Link from "next/link";
import { ProBadge } from "@/components/pro/ProBadge";
import { AccountLink } from "@/components/auth/AccountLink";

const NAV = [
  { href: "/app", label: "Dùng thử", show: "" },
  { href: "/hieu-them", label: "Hiểu thêm", show: "hidden md:inline-block" },
  { href: "/ung-dung", label: "Thực chiến", show: "hidden lg:inline-block" },
  { href: "/ve-chung-toi", label: "Về chúng tôi", show: "hidden md:inline-block" },
  // "Nâng cấp Pro" already leads to pricing, so phones keep room for "Đăng nhập".
  { href: "/bang-gia", label: "Bảng giá", show: "hidden sm:inline-block" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-night-950 print:hidden">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">The Paradox Matrix</span>
        </Link>
        <nav className="flex items-center gap-1 whitespace-nowrap text-sm sm:gap-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-2.5 py-1.5 text-ink-300 hover:bg-white/10 hover:text-white ${n.show}`}
            >
              {n.label}
            </Link>
          ))}
          <AccountLink />
          <ProBadge />
        </nav>
      </div>
    </header>
  );
}

export function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#111a30" stroke="rgba(255,255,255,0.15)" />
      <rect x="5" y="5" width="6" height="6" rx="1.5" fill="#fff" />
      <rect x="13" y="5" width="6" height="6" rx="1.5" fill="#3b6cf6" />
      <rect x="5" y="13" width="6" height="6" rx="1.5" fill="#3b6cf6" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#fff" />
    </svg>
  );
}
