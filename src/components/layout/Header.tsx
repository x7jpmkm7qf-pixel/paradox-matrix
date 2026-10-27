export function Header() {
  return (
    <header className="border-b border-ink-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="text-sm font-semibold tracking-tight text-ink-900">The Paradox Matrix</span>
          <span className="hidden rounded-full border border-ink-200 px-2 py-0.5 text-[11px] font-medium text-ink-500 sm:inline">
            Decision Lab
          </span>
        </div>
        <p className="hidden text-xs text-ink-500 md:block">Công cụ tư duy xác suất cho chủ doanh nghiệp & solopreneur</p>
      </div>
    </header>
  );
}

function Logo() {
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
