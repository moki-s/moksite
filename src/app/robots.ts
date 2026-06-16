import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// §10 — allow all; reference the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
