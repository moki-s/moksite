"use client";

import { useSyncExternalStore } from "react";

// Shared touch-detection hook for the mobile/touch adaptations. `(pointer:
// coarse)` matches the PRIMARY input only, so touch-screen laptops with a mouse
// stay on the desktop paths. Returns false on the server and during the first
// client paint — desktop markup is the SSR default everywhere this is used.
const QUERY = "(pointer: coarse)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function usePointerCoarse(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
