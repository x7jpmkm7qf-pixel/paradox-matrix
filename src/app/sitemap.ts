import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const PATHS = ["", "/app", "/bang-gia", "/hieu-them", "/ung-dung", "/ve-chung-toi", "/dieu-khoan", "/chinh-sach-bao-mat", "/chinh-sach-hoan-tien"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${SITE.url}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.6 }));
}
