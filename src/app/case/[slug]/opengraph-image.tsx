import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllCases, getCaseFrontmatter } from "@/lib/content";
import { siteConfig } from "@/content/site";

// §10 — branded per-case OG card: ink bg, Anton title, mono metadata, amber rule.
// Emit at build time (required by `output: export`; harmless for server builds).
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "moksite — case file";

export function generateStaticParams() {
  return getAllCases().map((entry) => ({ slug: entry.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseFrontmatter(slug);
  const title = entry?.title ?? "CASE FILE";
  const meta = entry
    ? `CASE ${String(entry.order).padStart(3, "0")} · ${entry.year} · STATUS: ${entry.status.toUpperCase()}`
    : "moksite";

  const [anton, mono] = await Promise.all([
    readFile(join(process.cwd(), "src/og-fonts/Anton-Regular.ttf")),
    readFile(join(process.cwd(), "src/og-fonts/IBMPlexMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0E13",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Mono", fontSize: 28, letterSpacing: 4, color: "#8A93A6" }}>
          {meta}
        </div>
        <div style={{ display: "flex", fontFamily: "Anton", fontSize: 92, lineHeight: 1.02, color: "#E8E4D8", textTransform: "uppercase" }}>
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 140, height: 6, background: "#F5A623", marginBottom: 24 }} />
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 26, letterSpacing: 4, color: "#F5A623" }}>
            MOKSITE — {siteConfig.name.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, style: "normal", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
