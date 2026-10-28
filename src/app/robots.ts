import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thanh-toan", "/kich-hoat"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
