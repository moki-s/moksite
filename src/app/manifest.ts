import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

// Emit at build time (required by `output: export`; harmless for server builds).
export const dynamic = "force-static";

// PWA manifest — colours from the §4 tokens, icons from the stamp motif.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.role}`,
    short_name: "moksite",
    description: `The portfolio of ${siteConfig.name}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e13",
    theme_color: "#0b0e13",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
