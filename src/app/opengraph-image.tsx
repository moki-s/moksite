import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/content/site";

// §10 — default OG card for the site (home and any route without its own image).
// Emit at build time (required by `output: export`; harmless for server builds).
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "moksite — a noir comic-book portfolio";

export default async function Image() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0E13",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Anton", fontSize: 120, lineHeight: 1, color: "#E8E4D8", textTransform: "uppercase", textAlign: "center" }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", width: 160, height: 6, background: "#F5A623", margin: "32px 0" }} />
        <div style={{ display: "flex", fontFamily: "Mono", fontSize: 28, letterSpacing: 4, color: "#F5A623" }}>
          {siteConfig.strapline}
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
