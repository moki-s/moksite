// §5.1 — single source of truth for the hero camera + the lit-window hotspot.
// CityScene renders with these constants and the hotspot is positioned by
// projecting the same world point through the same camera, so the two can never
// drift apart (and the poster script, which captures the live scene, matches by
// construction).

export type HeroOrientation = "landscape" | "portrait";

export const HERO_CAMERA: Record<
  HeroOrientation,
  { position: [number, number, number]; fov: number }
> = {
  // desktop values — unchanged from the Phase 4 scene
  landscape: { position: [0, 4, 18], fov: 50 },
  // portrait: pull back + widen so the skyline and the projected M both read
  // in a phone frame (numbers locked against scripts/poster-preview-portrait.png)
  portrait: { position: [0, 5, 22], fov: 58 },
};

// the projected "M" sprite scale per orientation (portrait slightly larger so
// the monogram stays legible in the narrower frame)
export const SIGNAL_SCALE: Record<HeroOrientation, [number, number, number]> = {
  landscape: [4.5, 5, 1],
  portrait: [5.2, 5.8, 1],
};

// §8 — hero quality tiers. Desktop values are byte-identical to the Phase 4
// scene (the defaults); the mobile tier trades invisible fidelity (DPR on
// 3x screens, AA on a dark scene, cone tessellation) for frame pacing.
export type HeroQuality = {
  dpr: [number, number];
  rainCount: number;
  antialias: boolean;
  coneSegments: [number, number];
  fpsCap: number | null;
  parallax: boolean;
};

export const DESKTOP_QUALITY: HeroQuality = {
  dpr: [1, 1.5],
  rainCount: 400,
  antialias: true,
  coneSegments: [48, 36],
  fpsCap: null,
  parallax: true,
};

export const MOBILE_QUALITY: HeroQuality = {
  dpr: [1, 1.25],
  rainCount: 200,
  antialias: false,
  coneSegments: [24, 18],
  fpsCap: 30,
  parallax: false, // no pointer on touch; no gyro in v1 (§5.1)
};

// The lit window the hero hotspot points at, in world space. Chosen so that the
// landscape projection lands on the CSS hotspot position (56% top / 58% left)
// that shipped with the desktop scene.
export const LIT_WINDOW_WORLD = { x: 1.72, y: 3.27, z: 5 };

// Standard pinhole projection for an untransformed camera looking down -Z (the
// scene camera has no rotation). Returns CSS percentage coordinates.
export function hotspotPercent(
  viewportWidth: number,
  viewportHeight: number,
): { topPct: number; leftPct: number } {
  const aspect = viewportWidth / viewportHeight;
  const cam = HERO_CAMERA[aspect < 1 ? "portrait" : "landscape"];
  const dist = cam.position[2] - LIT_WINDOW_WORLD.z;
  const tanV = Math.tan(((cam.fov / 2) * Math.PI) / 180);
  const tanH = tanV * aspect;
  const ndcX = (LIT_WINDOW_WORLD.x - cam.position[0]) / (tanH * dist);
  const ndcY = (LIT_WINDOW_WORLD.y - cam.position[1]) / (tanV * dist);
  return {
    leftPct: ((ndcX + 1) / 2) * 100,
    topPct: ((1 - ndcY) / 2) * 100,
  };
}
