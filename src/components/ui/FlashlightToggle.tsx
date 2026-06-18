"use client";

import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";

// §11 — footer FLASHLIGHT: ON/OFF toggle for the cursor torch (persisted). When
// off, the hidden props fall back to camouflaged-visible so they stay findable.
// Renders a stable label until mounted to avoid a hydration mismatch.
export function FlashlightToggle() {
  const enabled = useAppStore((s) => s.flashlightEnabled);
  const toggle = useAppStore((s) => s.toggleFlashlight);
  const mounted = useMounted();
  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={mounted ? enabled : undefined}
      onClick={toggle}
    >
      FLASHLIGHT: {mounted ? (enabled ? "ON" : "OFF") : "ON"}
    </button>
  );
}
