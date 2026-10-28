import type { Metadata } from "next";
import { Done } from "./Done";

export const metadata: Metadata = { title: "Đăng nhập xong · The Paradox Matrix", robots: { index: false } };

export default function Page() {
  return <Done />;
}
