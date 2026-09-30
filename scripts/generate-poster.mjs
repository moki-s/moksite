// Regenerates the hero posters from the live 3D scene — the LCP image + the
// fallback for poster-tier devices (§5.1, §8), so they must reflect the current
// look (cinematic beam + projected "M"). Two art-directed crops:
//   1600×900  → public/poster/hero.avif           (desktop / landscape)
//    900×1600 → public/poster/hero-portrait.avif  (mobile portrait — the scene's
//               portrait camera branch fires automatically at this viewport)
//
// How: load `/?poster=1` (forces the scene on + freezes the searchlight at its
// crest with the M centred), hide the DOM overlay, screenshot the canvas, then
// `sharp` → AVIF. No new deps — playwright + sharp are already devDeps.
//
// Prereq: a server running at http://localhost:3000 (pnpm start).
// Run: node scripts/generate-poster.mjs

import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE = process.env.POSTER_URL || "http://localhost:3000/?poster=1";

const browser = await chromium.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
  ],
});

async function capture(viewport, outWidth, outBase, previewName) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });

  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForTimeout(3500); // let textures upload + the frozen frame settle

  // hide everything that isn't the scene so the poster is canvas-only
  await page.evaluate(() => {
    const sels = [
      ".hero-overlay",
      ".hero-skip",
      ".hero-hotspot",
      ".lightning",
      "nav",
      ".grain",
      "footer",
    ];
    for (const sel of sels)
      document.querySelectorAll(sel).forEach((el) => (el.style.visibility = "hidden"));
  });

  const png = await page.locator(".hero").first().screenshot({ type: "png" });
  await page.close();

  await sharp(png).resize(outWidth).png().toFile(`scripts/${previewName}`);
  await sharp(png).resize(outWidth).avif({ quality: 55 }).toFile(outBase);

  const meta = await sharp(outBase).metadata();
  const { info } = await sharp(outBase).toBuffer({ resolveWithObject: true });
  console.log(
    `poster written: ${outBase} ${meta.width}x${meta.height}  avif=${Math.round(info.size / 1024)}KB`,
  );
  console.log(`console errors during capture: ${errors.length}`, errors.slice(0, 3));
}

await capture(
  { width: 1600, height: 900 },
  1600,
  "public/poster/hero.avif",
  "poster-preview.png",
);
await capture(
  { width: 900, height: 1600 },
  900,
  "public/poster/hero-portrait.avif",
  "poster-preview-portrait.png",
);

await browser.close();
