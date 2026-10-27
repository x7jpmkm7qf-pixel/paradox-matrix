"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { usePro } from "./ProProvider";
import { track } from "@/lib/pixel";

interface ProButtonProps {
  onClick: () => void;
  children: ReactNode;
  feature: string;
  variant?: "primary" | "ghost";
}

/** A button that runs its action for Pro users and shows an upgrade prompt for everyone else. */
export function ProButton({ onClick, children, feature, variant }: ProButtonProps) {
  const { isPro } = usePro();
  const [prompt, setPrompt] = useState(false);

  const handle = () => {
    if (isPro) return onClick();
    setPrompt(true);
    track("ViewContent", { content_name: `Paywall: ${feature}` });
  };

  return (
    <span className="relative inline-block">
      <Button variant={variant} onClick={handle}>
        {children}
        {!isPro && <span className="rounded bg-accent-100 px-1 text-[10px] font-semibold text-accent-700">PRO</span>}
      </Button>
      {prompt && (
        <span className="absolute left-0 top-full z-20 mt-2 block w-72 rounded-xl border border-ink-200 bg-white p-4 text-left shadow-lg">
          <span className="block text-sm font-semibold text-ink-900">{feature} là tính năng Pro</span>
          <span className="mt-1 block text-xs leading-relaxed text-ink-600">
            Mở khóa nhập/xuất bảng Excel và báo cáo PDF từ 149.900đ/tháng. Thanh toán bằng QR ngân hàng, kích hoạt tự động trong vài giây.
          </span>
          <span className="mt-3 flex gap-2">
            <Link href="/bang-gia" className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-800">
              Xem gói Pro
            </Link>
            <button type="button" onClick={() => setPrompt(false)} className="rounded-lg px-3 py-1.5 text-xs text-ink-500 hover:bg-ink-50">
              Để sau
            </button>
          </span>
        </span>
      )}
    </span>
  );
}
