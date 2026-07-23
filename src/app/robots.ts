import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Emit at build time (required by `output: export`; harmless for server builds).
export const dynamic = "force-static";

// §10 — allow all; reference the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
