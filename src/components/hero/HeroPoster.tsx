"use client";

import { useMotion } from "@/components/MotionProvider";
import { siteConfig } from "@/content/site";
import { CaptionBox } from "@/components/panels/CaptionBox";

// §5.1 (Phase-2 placeholder) — static poster (CSS background of an original noir
// SVG skyline) + overlay. The real R3F scene and final AVIF poster land in
// Phase 4. SKIP THE INTRO smooth-scrolls to #cases.
export function HeroPoster() {
  const { scrollTo } = useMotion();

  return (
    <section id="hero" aria-label="Cold open — a noir city at night" className="hero">
      <button
        type="button"
        className="hero-skip"
        onClick={() => scrollTo("#cases")}
      >
        SKIP THE INTRO →
      </button>

      <div className="hero-overlay">
        <h1 className="hero-name">{siteConfig.name}</h1>
        <p className="hero-strapline">{siteConfig.strapline}</p>
        <CaptionBox className="hero-caption">
          ISSUE #01 — SCROLL TO BEGIN
        </CaptionBox>
      </div>
    </section>
  );
}
