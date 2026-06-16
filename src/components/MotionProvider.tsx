"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useAppStore } from "@/store/useAppStore";

type ScrollTarget = string | number | HTMLElement;
type MotionContextValue = {
  motionEnabled: boolean;
  scrollTo: (target: ScrollTarget) => void;
};

const MotionContext = createContext<MotionContextValue>({
  motionEnabled: false,
  scrollTo: () => {},
});

export const useMotion = () => useContext(MotionContext);

// §5.2 — Lenis + GSAP ScrollTrigger, mounted once. Reduced motion (system or the
// footer MOTION: OFF toggle) disables Lenis entirely (native scroll, no pins).
export function MotionProvider({ children }: { children: ReactNode }) {
  const motionPref = useAppStore((s) => s.motionPref);
  const [systemReduced, setSystemReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    setMounted(true);
    const onChange = () => setSystemReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const motionEnabled =
    motionPref === "on" ? true : motionPref === "off" ? false : !systemReduced;

  // Reflect motion state on <html> so CSS can arm/disarm reveals.
  useEffect(() => {
    if (!mounted) return;
    const el = document.documentElement;
    el.classList.toggle("motion", motionEnabled);
    el.classList.toggle("no-motion", !motionEnabled);
  }, [mounted, motionEnabled]);

  useEffect(() => {
    if (!mounted) return;
    gsap.registerPlugin(ScrollTrigger);

    if (!motionEnabled) {
      // native scroll; make sure any previously-armed reveals settle visible.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // honour an initial deep-link hash once smooth scroll is live
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      requestAnimationFrame(() =>
        lenis.scrollTo(hash, { immediate: true, force: true }),
      );
    }

    ScrollTrigger.refresh();
    // re-measure after web fonts load (layout shifts otherwise)
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [mounted, motionEnabled]);

  const scrollTo = (target: ScrollTarget) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -8 });
      return;
    }
    const el =
      typeof target === "string" ? document.querySelector(target) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  return (
    <MotionContext.Provider value={{ motionEnabled, scrollTo }}>
      {children}
    </MotionContext.Provider>
  );
}
