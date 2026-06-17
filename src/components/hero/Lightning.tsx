"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import { dur } from "@/lib/motion";

// §5.1 — first-load-only lightning: a brief --bone full-screen flash (z-60) that
// silhouettes the city, with a small KRAK— caption. Never repeats in-session
// (Zustand flag, not persisted). DOM overlay — kept out of WebGL.
export function Lightning() {
  const flashRef = useRef<HTMLDivElement>(null);
  const krakRef = useRef<HTMLSpanElement>(null);
  const fired = useAppStore((s) => s.lightningFired);
  const setFired = useAppStore((s) => s.setLightningFired);

  useEffect(() => {
    if (fired || !flashRef.current) return;
    setFired(true);
    const tl = gsap.timeline();
    tl.fromTo(
      flashRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: dur.flash.duration, ease: dur.flash.ease },
    ).to(flashRef.current, { autoAlpha: 0, duration: 0.32, ease: "power2.out" });
    if (krakRef.current) {
      tl.fromTo(
        krakRef.current,
        { autoAlpha: 0, scale: 1.18 },
        { autoAlpha: 1, scale: 1, duration: 0.16, ease: "back.out(2)" },
        0.04,
      ).to(krakRef.current, { autoAlpha: 0, duration: 0.45 }, "+=0.25");
    }
    return () => {
      tl.kill();
    };
  }, [fired, setFired]);

  return (
    <div className="lightning" aria-hidden="true">
      <div ref={flashRef} className="lightning-flash" />
      <span ref={krakRef} className="lightning-krak">
        KRAK—
      </span>
    </div>
  );
}
