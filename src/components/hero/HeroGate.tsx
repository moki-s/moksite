"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { useMotion } from "@/components/MotionProvider";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useAppStore } from "@/store/useAppStore";
import { siteConfig } from "@/content/site";
import { CaptionBox } from "@/components/panels/CaptionBox";
import { Lightning } from "@/components/hero/Lightning";
import { dur } from "@/lib/motion";
import { track } from "@/lib/analytics";

// The 3D scene is the ONLY importer of three/@react-three/fiber, and it is pulled
// in exclusively here via dynamic(ssr:false) → three stays out of the initial
// bundle (§8).
const CityScene = dynamic(() => import("@/components/hero/CityScene"), {
  ssr: false,
});

function supportsWebGL2(): boolean {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

// §5.1 — poster is the LCP and the static fallback; the 3D scene gates on
// motion + capability and crossfades in. SKIP / overlay / hotspot are always in
// the DOM (instant, no-JS-friendly).
export function HeroGate() {
  const { scrollTo, motionEnabled } = useMotion();
  const openTerminal = useAppStore((s) => s.openTerminal);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [show3D, setShow3D] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(true);

  // capability gate
  useEffect(() => {
    if (!motionEnabled) {
      setShow3D(false);
      return;
    }
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMem = typeof deviceMemory === "number" && deviceMemory < 4;
    setShow3D(!lowMem && supportsWebGL2());
  }, [motionEnabled]);

  // pause when off-screen or the tab is hidden (§8)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = (onScreen: boolean) => setActive(onScreen && !document.hidden);
    const io = new IntersectionObserver(([e]) => update(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    const onVis = () =>
      update(el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < window.innerHeight);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [show3D]);

  // ink-stamp name entrance (§5.1) — motion only
  useIsomorphicLayoutEffect(() => {
    if (!motionEnabled || !nameRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(nameRef.current, {
        autoAlpha: 0,
        scale: 1.06,
        duration: dur.enter.duration,
        ease: dur.enter.ease,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [motionEnabled]);

  const cssRain = motionEnabled && !show3D;

  return (
    <section ref={sectionRef} id="hero" aria-label="Cold open — a noir city at night" className="hero">
      <Image
        src="/poster/hero.avif"
        alt=""
        aria-hidden="true"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="hero-poster-img"
      />

      {cssRain && <div className="hero-css-rain" aria-hidden="true" />}

      {show3D && (
        <div className={`hero-canvas${loaded ? " is-loaded" : ""}`} aria-hidden="true">
          <CityScene active={active} onCreated={() => setLoaded(true)} />
        </div>
      )}

      {show3D && <Lightning />}

      <button
        type="button"
        className="hero-skip"
        onClick={() => {
          track("skip_intro");
          scrollTo("#cases");
        }}
      >
        SKIP THE INTRO →
      </button>

      <div className="hero-overlay">
        <h1 ref={nameRef} className="hero-name">
          {siteConfig.name}
        </h1>
        <p className="hero-strapline">{siteConfig.strapline}</p>
        <CaptionBox className="hero-caption">ISSUE #01 — SCROLL TO BEGIN</CaptionBox>
      </div>

      <button
        type="button"
        className="hero-hotspot"
        aria-label="A lit window. Something hums inside."
        onClick={() => {
          track("terminal_open", { method: "window" });
          openTerminal();
        }}
      />
    </section>
  );
}
