"use client";

import { useEffect, useRef } from "react";
import { EVIDENCE, type EvidencePanel } from "@/components/game/evidence";
import { HiddenProp } from "@/components/game/HiddenProp";
import { useMotion } from "@/components/MotionProvider";
import { useAppStore } from "@/store/useAppStore";

// Overlay of hidden-object hotspots for one panel. Rendered as the LAST child of
// its panel so the skip-to-content link stays first and the props sit after that
// panel's content in tab order (§9). The layer ignores pointer events; only the
// buttons capture them.
//
// "Flashlight" reveal: on a fine pointer with motion on, props are invisible until
// the cursor sweeps near them (a soft radius lights them up, like a detective's
// torch). On touch / reduced-motion / no-JS, CSS keeps them faintly visible
// (camouflaged) so they stay findable — see globals.css.
const RADIUS = 150; // px — how close the cursor must get to reveal a prop

export function EvidenceLayer({ panel }: { panel: EvidencePanel }) {
  const props = EVIDENCE.filter((p) => p.panel === panel);
  const ref = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useMotion();
  const flashlightOn = useAppStore((s) => s.flashlightEnabled);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!flashlightOn || !motionEnabled || !window.matchMedia("(pointer: fine)").matches)
      return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".evidence-prop"));
    let raf = 0;
    let px = -9999;
    let py = -9999;

    const apply = () => {
      raf = 0;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        n.style.setProperty("--reveal", Math.max(0, Math.min(1, 1 - d / RADIUS)).toFixed(3));
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      for (const n of nodes) n.style.removeProperty("--reveal");
    };
  }, [motionEnabled, flashlightOn]);

  if (props.length === 0) return null;
  return (
    <div ref={ref} className="evidence-layer" data-flashlight={flashlightOn ? "" : undefined}>
      {props.map((p) => (
        <HiddenProp key={p.id} {...p} />
      ))}
    </div>
  );
}
