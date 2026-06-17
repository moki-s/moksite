import { create } from "zustand";
import { persist } from "zustand/middleware";

// §9 — manual MOTION: ON/OFF override (persisted). "system" follows the OS
// prefers-reduced-motion setting. Session-only flags (lightning, terminal) are
// NOT persisted (partialize below keeps only motionPref).
export type MotionPref = "system" | "on" | "off";

type AppState = {
  motionPref: MotionPref;
  setMotionPref: (pref: MotionPref) => void;
  lightningFired: boolean;
  setLightningFired: (fired: boolean) => void;
  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      motionPref: "system",
      setMotionPref: (motionPref) => set({ motionPref }),
      lightningFired: false,
      setLightningFired: (lightningFired) => set({ lightningFired }),
      terminalOpen: false,
      openTerminal: () => set({ terminalOpen: true }),
      closeTerminal: () => set({ terminalOpen: false }),
    }),
    {
      name: "moksite-prefs",
      partialize: (state) => ({ motionPref: state.motionPref }),
    },
  ),
);
