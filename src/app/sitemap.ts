import type { MetadataRoute } from "next";
import { getAllCases } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

// §10 — all static routes + cases. Calling getAllCases() here means content
// validation runs during `next build` (bad frontmatter fails the build).
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/dossier"), changeFrequency: "monthly", priority: 0.8 },
  ];

  const caseRoutes: MetadataRoute.Sitemap = getAllCases().map((entry) => ({
    url: absoluteUrl(`/case/${entry.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseRoutes];
}
