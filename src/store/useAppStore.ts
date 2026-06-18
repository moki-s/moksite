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
  highContrast: boolean;
  toggleHighContrast: () => void;
  // §11 — hidden-object hunt; persisted so it survives navigating into a case.
  foundEvidence: string[];
  markFound: (id: string) => void;
  // cursor torch on/off (persisted); off → props are camouflaged-visible instead.
  flashlightEnabled: boolean;
  toggleFlashlight: () => void;
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
      highContrast: false,
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      foundEvidence: [],
      markFound: (id) =>
        set((s) =>
          s.foundEvidence.includes(id)
            ? s
            : { foundEvidence: [...s.foundEvidence, id] },
        ),
      flashlightEnabled: true,
      toggleFlashlight: () =>
        set((s) => ({ flashlightEnabled: !s.flashlightEnabled })),
    }),
    {
      name: "moksite-prefs",
      partialize: (state) => ({
        motionPref: state.motionPref,
        highContrast: state.highContrast,
        foundEvidence: state.foundEvidence,
        flashlightEnabled: state.flashlightEnabled,
      }),
    },
  ),
);
