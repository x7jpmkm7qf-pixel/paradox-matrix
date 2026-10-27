"use client";

import Link from "next/link";
import { usePro } from "./ProProvider";

export function ProBadge() {
  const { isPro } = usePro();
  if (isPro === null) return <span className="w-16" />;
  if (isPro) {
    return (
      <Link href="/kich-hoat" className="rounded-full bg-accent-600 px-2.5 py-1 text-xs font-semibold text-white">
        PRO
      </Link>
    );
  }
  return (
    <Link href="/bang-gia" className="whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-800">
      Nâng cấp Pro
    </Link>
  );
}
