"use client";

import dynamic from "next/dynamic";

// Lazy (ssr:false) — part of the non-critical hunt layer, kept off the initial path.
const Flashlight = dynamic(
  () => import("@/components/game/Flashlight").then((m) => m.Flashlight),
  { ssr: false },
);

export function FlashlightLazy() {
  return <Flashlight />;
}
