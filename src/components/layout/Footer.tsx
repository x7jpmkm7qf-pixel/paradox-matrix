import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white print:hidden">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-ink-500 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold text-ink-900">{SITE.name}</p>
          <p className="mt-2 leading-relaxed">
            Sản phẩm của hệ{" "}
            <a href={SITE.brandUrl} className="underline hover:text-ink-900">
              {SITE.brand}
            </a>
            . Mọi tính toán chạy ngay trên trình duyệt của bạn, số liệu không gửi đi đâu.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink-900">Hỗ trợ</p>
          <ul className="mt-2 space-y-1">
            <li>
              Zalo:{" "}
              <a href={`https://zalo.me/${SITE.zalo}`} className="hover:text-ink-900">
                {SITE.zaloDisplay}
              </a>
            </li>
            <li>
              Email:{" "}
              <a href={`mailto:${SITE.email}`} className="hover:text-ink-900">
                {SITE.email}
              </a>
            </li>
            <li>Đơn vị vận hành: {SITE.operator}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-ink-900">Chính sách</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/dieu-khoan" className="hover:text-ink-900">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-bao-mat" className="hover:text-ink-900">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-hoan-tien" className="hover:text-ink-900">
                Chính sách hoàn tiền
              </Link>
            </li>
            <li>
              <Link href="/kich-hoat" className="hover:text-ink-900">
                Kích hoạt / khôi phục Pro
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
