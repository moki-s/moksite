"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/MotionProvider";

// §5.6 — soft amber radial that follows the cursor across the Signal panel.
// Reduced motion / touch (no pointer moves) → it stays centred. Decorative only;
// the form is always ≥ AA contrast regardless.
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useMotion();

  useEffect(() => {
    if (!motionEnabled) return;
    const el = ref.current;
    const panel = el?.closest("section");
    if (!el || !panel) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    panel.addEventListener("pointermove", onMove);
    return () => panel.removeEventListener("pointermove", onMove);
  }, [motionEnabled]);

  return <div ref={ref} className="signal-spotlight" aria-hidden="true" />;
}
