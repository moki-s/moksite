"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { usePointerCoarse } from "@/lib/usePointerCoarse";
import { useMotion } from "@/components/MotionProvider";
import { EVIDENCE_TOTAL } from "@/components/game/evidence";

// §11 touch-torch — the coarse-pointer entry into the hidden-object hunt.
// Touch has no cursor to sweep, so the torch is an explicit MODE: while armed,
// the panel evidence layers capture touches (scrolling pauses — deliberate,
// reversible) and a finger-tracked light pool reveals nearby props; sweeping
// over a revealed prop bags it. Renders nothing on fine pointers / reduced
// motion (those keep their own paths) or once the case is cracked.
const IDLE_DISARM_MS = 12_000;

export function TorchToggle() {
  const mounted = useMounted();
  const coarse = usePointerCoarse();
  const { motionEnabled } = useMotion();
  const armed = useAppStore((s) => s.torchArmed);
  const setArmed = useAppStore((s) => s.setTorchArmed);
  const flashlightEnabled = useAppStore((s) => s.flashlightEnabled);
  const huntDone = useAppStore((s) => s.foundEvidence.length >= EVIDENCE_TOTAL);
  const terminalOpen = useAppStore((s) => s.terminalOpen);
  const [hinted, setHinted] = useState(false);

  // the torch never stays armed behind the terminal or a finished hunt
  useEffect(() => {
    if (armed && (terminalOpen || huntDone)) setArmed(false);
  }, [armed, terminalOpen, huntDone, setArmed]);

  // auto-disarm after inactivity so an armed torch can't strand scrolling
  useEffect(() => {
    if (!armed) return;
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setArmed(false), IDLE_DISARM_MS);
    };
    reset();
    window.addEventListener("pointerdown", reset, { passive: true });
    window.addEventListener("pointermove", reset, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("pointermove", reset);
    };
  }, [armed, setArmed]);

  if (!mounted || !coarse || !motionEnabled || !flashlightEnabled || huntDone) return null;

  return (
    <div className="torch-toggle-wrap">
      <button
        type="button"
        className="torch-toggle"
        aria-pressed={armed}
        aria-label="Light the detective's torch to search this panel"
        onClick={() => {
          const next = !armed;
          setArmed(next);
          if (next) setHinted(true);
        }}
      >
        TORCH: {armed ? "ON" : "OFF"}
      </button>
      {armed && !huntDone && hinted && (
        <span className="torch-hint" aria-hidden="true">
          sweep to search · tap to bag
        </span>
      )}
    </div>
  );
}
