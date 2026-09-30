"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { useMotion } from "@/components/MotionProvider";
import { usePointerCoarse } from "@/lib/usePointerCoarse";
import { EVIDENCE_TOTAL } from "@/components/game/evidence";

// A soft cool-bone light pool — the detective's torch. It only lightens the
// scene (mix-blend: screen in CSS) and is moved with a GPU transform (no
// full-screen repaint). Fine pointers: follows the cursor whenever the hunt is
// unfinished (unchanged desktop behavior). Coarse pointers: appears only while
// the touch-torch is ARMED (TorchToggle) and a finger is down, tracking the
// sweep. See globals.css + DECISIONS.md (§4.1).
export function Flashlight() {
  const mounted = useMounted();
  const { motionEnabled } = useMotion();
  const huntDone = useAppStore((s) => s.foundEvidence.length >= EVIDENCE_TOTAL);
  const flashlightEnabled = useAppStore((s) => s.flashlightEnabled);
  const torchArmed = useAppStore((s) => s.torchArmed);
  const coarse = usePointerCoarse();
  const ref = useRef<HTMLDivElement>(null);
  const active =
    mounted && motionEnabled && flashlightEnabled && !huntDone && (!coarse || torchArmed);

  useEffect(() => {
    if (!active) return;
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
    const hide = () => {
      el.style.opacity = "0";
    };

    if (!coarse) {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const onMove = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        if (!raf) raf = requestAnimationFrame(apply);
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
    }

    // coarse + armed: the pool lives under the finger while it's down
    const onPoint = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointerdown", onPoint, { passive: true });
    window.addEventListener("pointermove", onPoint, { passive: true });
    window.addEventListener("pointerup", hide);
    window.addEventListener("pointercancel", hide);
    return () => {
      window.removeEventListener("pointerdown", onPoint);
      window.removeEventListener("pointermove", onPoint);
      window.removeEventListener("pointerup", hide);
      window.removeEventListener("pointercancel", hide);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, coarse]);

  if (!active) return null;
  return <div ref={ref} className="flashlight" aria-hidden="true" />;
}
