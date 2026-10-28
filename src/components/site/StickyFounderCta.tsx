"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Phone-only bar pinned to the bottom of the landing page: appears once the hero is
 * scrolled past and steps aside while the pricing table (which has its own buttons) is on screen.
 */
export function StickyFounderCta({ price, seatsNote }: { price: string; seatsNote: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const pricing = document.getElementById("bang-gia");
    const io =
      pricing && "IntersectionObserver" in window
        ? new IntersectionObserver(([e]) => setPricingVisible(e.isIntersecting), { threshold: 0.15 })
        : null;
    if (pricing && io) io.observe(pricing);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const shown = pastHero && !pricingVisible;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night-950/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(6,10,23,0.35)] backdrop-blur transition-transform duration-300 sm:hidden print:hidden ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium text-flame-300">Gói Sáng lập · dùng trọn đời</p>
          <p className="truncate text-sm font-bold text-white">
            {price} <span className="text-xs font-medium text-ink-400">· {seatsNote}</span>
          </p>
        </div>
        <Link
          href="/thanh-toan?goi=founder"
          tabIndex={shown ? 0 : -1}
          className="shrink-0 rounded-xl bg-flame-500 px-4 py-2.5 text-sm font-bold text-night-950 shadow-flame active:bg-flame-400"
        >
          Giữ suất ngay
        </Link>
      </div>
    </div>
  );
}
