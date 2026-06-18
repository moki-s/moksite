"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { EvidenceLayerLazy } from "@/components/game/EvidenceLayerLazy";

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

  // `?poster=1` forces the scene on (bypassing the capability gate) and freezes
  // the searchlight at its crest — a deterministic frame for the poster-capture
  // script (scripts/generate-poster.mjs). Harmless in normal use.
  const isPoster = useMemo(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("poster"),
    [],
  );

  // capability gate — the 3D cold-open is a desktop-class enhancement. Phones,
  // tablets, touch and low-power devices keep the poster (the LCP element and the
  // §16 fallback); this is also what keeps mobile LCP/TBT inside the §2 budget,
  // since a continuously-animating WebGL scene saturates a throttled main thread.
  useEffect(() => {
    if (isPoster) {
      setShow3D(true);
      return;
    }
    if (!motionEnabled) {
      setShow3D(false);
      return;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
    const fewCores =
      typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wideEnough = window.innerWidth >= 1024;
    setShow3D(!lowMem && !fewCores && finePointer && wideEnough && supportsWebGL2());
  }, [motionEnabled, isPoster]);

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
      // Scale-only settle — no opacity gate. The <h1> is the LCP element, so it
      // must stay painted from first paint; animating autoAlpha would hide it
      // until hydration and push LCP past the §2 budget.
      gsap.from(nameRef.current, {
        scale: 1.05,
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
          <CityScene
            active={active || isPoster}
            frozen={isPoster}
            onCreated={() => setLoaded(true)}
          />
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

      <EvidenceLayerLazy panel="hero" />
    </section>
  );
}
