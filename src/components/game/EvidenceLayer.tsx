"use client";

import { useEffect, useRef } from "react";
import { EVIDENCE, type EvidencePanel } from "@/components/game/evidence";
import { HiddenProp } from "@/components/game/HiddenProp";
import { useMotion } from "@/components/MotionProvider";
import { useAppStore } from "@/store/useAppStore";
import { usePointerCoarse } from "@/lib/usePointerCoarse";

// Overlay of hidden-object hotspots for one panel. Rendered as the LAST child of
// its panel so the skip-to-content link stays first and the props sit after that
// panel's content in tab order (§9). The layer ignores pointer events; only the
// buttons capture them.
//
// Reveal paths:
//  - fine pointer + motion: props invisible until the cursor sweeps near (the
//    detective's torch) — unchanged desktop behavior.
//  - coarse pointer + motion: props are hidden AND inert until the touch-torch
//    is armed (TorchToggle). While armed, this layer becomes the sweep surface
//    (touch-action: none): a finger-tracked pool reveals nearby props, which
//    become tappable (data-lit) — sweep over one or tap it to bag it.
//  - reduced motion / no-JS: CSS keeps props faintly visible (camouflaged) so
//    they stay findable — see globals.css. Keyboard/AT always collect via
//    focus/click regardless of the torch (the non-visual completion path).
const RADIUS = 150; // px — fine-pointer reveal radius
const TOUCH_RADIUS = 110; // px — thumb-sweep reveal radius
const LIT_THRESHOLD = 0.35; // coarse: reveal level at which a prop turns tappable
const AFTERGLOW_MS = 1500; // coarse: how long reveals linger after the finger lifts

export function EvidenceLayer({ panel }: { panel: EvidencePanel }) {
  const props = EVIDENCE.filter((p) => p.panel === panel);
  const ref = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useMotion();
  const flashlightOn = useAppStore((s) => s.flashlightEnabled);
  const coarse = usePointerCoarse();
  const torchArmed = useAppStore((s) => s.torchArmed);

  // fine-pointer flashlight reveal (desktop — unchanged)
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (coarse) return;
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
  }, [motionEnabled, flashlightOn, coarse]);

  // coarse-pointer torch sweep (touch — the layer is the sweep surface)
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!coarse || !torchArmed || !flashlightOn || !motionEnabled) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".evidence-prop"));
    let raf = 0;
    let px = -9999;
    let py = -9999;
    let fadeTimer = 0;

    const apply = () => {
      raf = 0;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
        const v = Math.max(0, Math.min(1, 1 - d / TOUCH_RADIUS));
        n.style.setProperty("--reveal", v.toFixed(3));
        n.toggleAttribute("data-lit", v > LIT_THRESHOLD);
      }
    };
    const onPoint = (e: PointerEvent) => {
      window.clearTimeout(fadeTimer);
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const clear = () => {
      for (const n of nodes) {
        n.style.setProperty("--reveal", "0");
        n.removeAttribute("data-lit");
      }
    };
    const onUp = () => {
      // afterglow: keep reveals briefly so a lift-then-tap still lands
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(clear, AFTERGLOW_MS);
    };

    root.addEventListener("pointerdown", onPoint);
    root.addEventListener("pointermove", onPoint);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointerdown", onPoint);
      root.removeEventListener("pointermove", onPoint);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      window.clearTimeout(fadeTimer);
      if (raf) cancelAnimationFrame(raf);
      clear();
      for (const n of nodes) n.style.removeProperty("--reveal");
    };
  }, [coarse, torchArmed, flashlightOn, motionEnabled]);

  if (props.length === 0) return null;
  return (
    <div
      ref={ref}
      className="evidence-layer"
      data-flashlight={flashlightOn ? "" : undefined}
      data-torch={coarse && torchArmed && flashlightOn && motionEnabled ? "" : undefined}
    >
      {props.map((p) => (
        <HiddenProp key={p.id} {...p} />
      ))}
    </div>
  );
}
