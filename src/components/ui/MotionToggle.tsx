"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

// §9 — footer MOTION: ON/OFF toggle. Overrides system preference, persisted via
// the Zustand store. Renders a stable label until mounted to avoid hydration
// mismatch (store rehydrates from localStorage on the client).
export function MotionToggle() {
  const motionPref = useAppStore((s) => s.motionPref);
  const setMotionPref = useAppStore((s) => s.setMotionPref);
  const [mounted, setMounted] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSystemReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const enabled =
    motionPref === "on" ? true : motionPref === "off" ? false : !systemReduced;

  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={mounted ? enabled : undefined}
      onClick={() => setMotionPref(enabled ? "off" : "on")}
    >
      MOTION: {mounted ? (enabled ? "ON" : "OFF") : "ON"}
    </button>
  );
}
