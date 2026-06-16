// §4.4 — motion tokens. Single source of truth; every GSAP timeline consumes
// these (never hard-coded durations/eases elsewhere).
export const dur = {
  flash: { duration: 0.12, ease: "none" }, // lightning (Phase 4)
  micro: { duration: 0.2, ease: "power2.out" }, // hovers, links
  stamp: { duration: 0.3, ease: "back.out(2)" }, // CLASSIFIED stamp
  enter: { duration: 0.6, ease: "power3.out" }, // panel content reveals
  wipe: { duration: 0.45, ease: "power4.inOut" }, // gutter/transition wipes
} as const;

// §9 — reduced-motion fallback: a quick fade, ≤ 0.15s (used only if a tween must
// still run under reduced motion; most are simply skipped).
export const reduced = { duration: 0.15, ease: "power1.out" } as const;
