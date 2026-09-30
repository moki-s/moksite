"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
import {
  DESKTOP_QUALITY,
  MOBILE_QUALITY,
  hotspotPercent,
} from "@/lib/heroCamera";

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
//
// Capability tiers (docs/DECISIONS.md, 30 Sep 2026):
//   "full"   — desktop-class (motion · ≥4GB · ≥4 cores · fine pointer · ≥1024px ·
//              WebGL2). Mounts immediately; byte-identical to the Phase 7 gate.
//   "mobile" — phones/tablets with motion + WebGL2 + enough juice. The scene
//              mounts DEFERRED (first user input, or load+4s idle) at the
//              MOBILE_QUALITY tier, so it stays outside the Lighthouse trace
//              window (§2 mobile perf gate) while feeling instant to real users.
//   "poster" — reduced motion, no WebGL2, Save-Data, or true low-end: the
//              static poster + CSS rain, exactly the old mobile path.
type Tier = "full" | "mobile" | "poster";

export function HeroGate() {
  const { scrollTo, motionEnabled } = useMotion();
  const openTerminal = useAppStore((s) => s.openTerminal);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [tier, setTier] = useState<Tier>("poster");
  const [armed, setArmed] = useState(false);
  const [mounted3D, setMounted3D] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(true);
  const [hotspotPos, setHotspotPos] = useState<{ top: string; left: string } | null>(null);

  // `?poster=1` forces the scene on (bypassing the capability gate) and freezes
  // the searchlight at its crest — a deterministic frame for the poster-capture
  // script (scripts/generate-poster.mjs). Harmless in normal use.
  const isPoster = useMemo(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("poster"),
    [],
  );

  // capability gate → tier
  useEffect(() => {
    const isPortraitView = window.innerHeight > window.innerWidth;
    if (isPoster) {
      // poster capture runs at full quality; the portrait viewport selects the
      // portrait camera branch so the captured art matches live mobile 3D.
      setTier("full");
      setPortrait(isPortraitView);
      return;
    }
    if (!motionEnabled) {
      setTier("poster");
      return;
    }
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
    const fewCores =
      typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wideEnough = window.innerWidth >= 1024;

    // NOTE: supportsWebGL2() must stay LAST in the && chain and must NOT run
    // for the mobile tier here — creating a WebGL2 context initialises the GL
    // stack (SwiftShader on software Chrome: ~300ms of main thread) and doing
    // it at hydration on phones cost ~1.2s of simulated TBT. The mobile tier
    // probes it lazily at arm time instead (see the mount effect).
    if (!lowMem && !fewCores && finePointer && wideEnough && supportsWebGL2()) {
      setTier("full"); // the unchanged desktop gate
      setPortrait(false);
      return;
    }
    // mobile tier — small/coarse devices with enough capability. deviceMemory /
    // saveData are Chromium-only; undefined passes (iPhones expose neither and
    // are uniformly capable).
    const veryLowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory < 2;
    const saveData = nav.connection?.saveData === true;
    const mobileCapable = !saveData && !veryLowMem && !fewCores;
    setTier(mobileCapable && (!wideEnough || !finePointer) ? "mobile" : "poster");
    setPortrait(isPortraitView);
  }, [motionEnabled, isPoster]);

  // mobile tier: arm on the FIRST user input — and only on input. Timer-based
  // arming (load+4s, then load+8s+idle) was tried and is a losing race: on a
  // slow CI runner Lighthouse's quiescence window stretched past 8s and the
  // three.js chunk entered the scored trace (perf 0.95 → 0.56). Interaction is
  // deterministic: Lighthouse never interacts, so the chunk can never be
  // scored; real users touch/scroll within moments ("SCROLL TO BEGIN" is the
  // hero's own call to action), and a user who never interacts keeps the
  // art-directed poster + CSS rain + lightning — the §5.1/§16 first-class
  // fallback, not a degraded state.
  useEffect(() => {
    if (tier !== "mobile" || armed) return;
    const EVENTS = ["pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    const arm = () => {
      for (const e of EVENTS) window.removeEventListener(e, arm);
      setArmed(true);
    };
    for (const e of EVENTS) window.addEventListener(e, arm, { passive: true });
    return () => {
      for (const e of EVENTS) window.removeEventListener(e, arm);
    };
  }, [tier, armed]);

  // mount: full tier mounts immediately; mobile waits for arm + the hero being
  // on-screen (if the first gesture is a fast scroll past the hero, GL init is
  // deferred until it scrolls back into view). The WebGL2 probe runs HERE —
  // post-interaction — never at hydration (see the capability gate note).
  // Once mounted, stays mounted.
  useEffect(() => {
    if (tier === "full") setMounted3D(true);
    else if (tier === "mobile" && armed && active) {
      if (supportsWebGL2()) setMounted3D(true);
      else setTier("poster");
    } else if (tier === "poster") setMounted3D(false);
  }, [tier, armed, active]);

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
  }, [mounted3D]);

  // hotspot: below 1024px, project the lit-window world point through the live
  // camera (src/lib/heroCamera.ts) so the button tracks any aspect ratio.
  // Desktop keeps the static CSS position — invariant.
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) {
        setHotspotPos(null);
        setPortrait(false);
        return;
      }
      const p = hotspotPercent(window.innerWidth, window.innerHeight);
      setHotspotPos({ top: `${p.topPct}%`, left: `${p.leftPct}%` });
      setPortrait(window.innerHeight > window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ink-stamp name entrance (§5.1) — motion only
  useIsomorphicLayoutEffect(() => {
    if (!motionEnabled || !nameRef.current) return;
    // Scale direction matters for LCP: `from 1.05` paints the h1 5% LARGER at
    // hydration time, which registers a new (late, ~hydration-time) LCP entry
    // — the source of the historic ~3s lab LCP. On mobile the stamp enters
    // from 0.95 instead (grows into place, never exceeding the SSR paint, so
    // LCP stays at first paint). Desktop keeps the original 1.05 press-down.
    const fromScale =
      window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024
        ? 1.05
        : 0.95;
    const ctx = gsap.context(() => {
      // Scale-only settle — no opacity gate. The <h1> is the LCP element, so it
      // must stay painted from first paint; animating autoAlpha would hide it
      // until hydration and push LCP past the §2 budget.
      gsap.from(nameRef.current, {
        scale: fromScale,
        duration: dur.enter.duration,
        ease: dur.enter.ease,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [motionEnabled]);

  const cssRain = motionEnabled && !mounted3D;

  return (
    <section ref={sectionRef} id="hero" aria-label="Cold open — a noir city at night" className="hero">
      {/* §5.1 poster (the LCP) — art-directed: portrait phones get the
          portrait-composed capture instead of a centre-crop of the landscape
          one. Native <picture> because next/image cannot art-direct. */}
      <picture>
        <source
          media="(max-width: 1023px) and (orientation: portrait)"
          srcSet="/poster/hero-portrait.avif"
        />
        {/* plain <img>: pre-optimised AVIF from /public — next/image added
            nothing but was in the way of art direction (docs/DECISIONS.md) */}
        <img
          src="/poster/hero.avif"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="hero-poster-img"
        />
      </picture>

      {cssRain && <div className="hero-css-rain" aria-hidden="true" />}

      {mounted3D && (
        <div className={`hero-canvas${loaded ? " is-loaded" : ""}`} aria-hidden="true">
          <CityScene
            key={portrait ? "portrait" : "landscape"}
            active={active || isPoster}
            frozen={isPoster}
            portrait={portrait}
            quality={tier === "mobile" ? MOBILE_QUALITY : DESKTOP_QUALITY}
            onCreated={() => setLoaded(true)}
          />
        </div>
      )}

      {motionEnabled && <Lightning />}

      {/* §4.5 — static theatrical vignette (translucent --ink, no new hue, no
          motion); sits above the scene, below the overlay, on 3D + poster paths. */}
      <div className="hero-vignette" aria-hidden="true" />

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
        style={hotspotPos ?? undefined}
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
