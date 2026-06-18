// Regenerates the 1600w hero poster (public/poster/hero.avif) from the live 3D
// scene — the LCP image + the mobile / no-WebGL fallback (§5.1, §8), so it must
// reflect the current look (cinematic beam + projected "M").
//
// How: load `/?poster=1` (forces the scene on + freezes the searchlight at its
// crest with the M centred), hide the DOM overlay, screenshot the canvas, then
// `sharp` → 1600w AVIF. No new deps — playwright + sharp are already devDeps.
//
// Prereq: a server running at http://localhost:3000 (pnpm start).
// Run: node scripts/generate-poster.mjs

import { chromium } from "@playwright/test";
import sharp from "sharp";

const URL = process.env.POSTER_URL || "http://localhost:3000/?poster=1";

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

const page = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(URL, { waitUntil: "networkidle" });
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
await browser.close();

await sharp(png).resize(1600).png().toFile("scripts/poster-preview.png");
await sharp(png).resize(1600).avif({ quality: 55 }).toFile("public/poster/hero.avif");

const meta = await sharp("public/poster/hero.avif").metadata();
const { info } = await sharp("public/poster/hero.avif").toBuffer({ resolveWithObject: true });
console.log(`poster written: ${meta.width}x${meta.height}  avif=${Math.round(info.size / 1024)}KB`);
console.log(`console errors during capture: ${errors.length}`, errors.slice(0, 3));
