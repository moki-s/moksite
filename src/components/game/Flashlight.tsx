"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { useMotion } from "@/components/MotionProvider";
import { EVIDENCE_TOTAL } from "@/components/game/evidence";

// A soft cool-bone light pool that follows the cursor — the detective's torch.
// It only lightens the scene (mix-blend: screen in CSS) and is moved with a GPU
// transform (no full-screen repaint). Active on desktop + motion + fine pointer,
// and only while the hunt is unfinished. See globals.css + DECISIONS.md (§4.1).
export function Flashlight() {
  const mounted = useMounted();
  const { motionEnabled } = useMotion();
  const huntDone = useAppStore((s) => s.foundEvidence.length >= EVIDENCE_TOTAL);
  const flashlightEnabled = useAppStore((s) => s.flashlightEnabled);
  const ref = useRef<HTMLDivElement>(null);
  const active = mounted && motionEnabled && flashlightEnabled && !huntDone;

  useEffect(() => {
    if (!active) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = "1";
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", hide);
      document.removeEventListener("mouseleave", hide);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!active) return null;
  return <div ref={ref} className="flashlight" aria-hidden="true" />;
}
