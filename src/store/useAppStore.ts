import { create } from "zustand";
import { persist } from "zustand/middleware";

// §9 — manual MOTION: ON/OFF override, persisted. "system" follows the OS
// prefers-reduced-motion setting. (Terminal / high-contrast state arrive in
// Phase 5.)
export type MotionPref = "system" | "on" | "off";

type AppState = {
  motionPref: MotionPref;
  setMotionPref: (pref: MotionPref) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      motionPref: "system",
      setMotionPref: (motionPref) => set({ motionPref }),
    }),
    { name: "moksite-prefs" },
  ),
);
