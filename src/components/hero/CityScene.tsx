"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Rain } from "@/components/hero/Rain";
import { Searchlight } from "@/components/hero/Searchlight";
import {
  DESKTOP_QUALITY,
  HERO_CAMERA,
  SIGNAL_SCALE,
  type HeroQuality,
} from "@/lib/heroCamera";

// Deterministic PRNG so the skyline is identical every visit (§5.1).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tiny canvas texture: dark facade with ~8% amber-lit windows (§5.1) — no
// downloaded assets (§8).
function makeWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#141b2d";
  ctx.fillRect(0, 0, 64, 128);
  const rng = mulberry32(99);
  const cols = 4;
  const rows = 8;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const lit = rng() < 0.08;
      // lit windows restored to a livelier glow (buildings pass) — the beam is
      // still the dominant warm light by scale; these read as a living city.
      ctx.globalAlpha = lit ? 0.5 + rng() * 0.3 : 1;
      ctx.fillStyle = lit ? "#f5a623" : "#0e1320";
      ctx.fillRect(x * 16 + 4, y * 16 + 5, 8, 9);
    }
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2.5);
  return tex;
}

type Building = { pos: [number, number, number]; scale: [number, number, number] };

function City({ texture }: { texture: THREE.Texture }) {
  const cityRef = useRef<THREE.InstancedMesh>(null);

  const buildings = useMemo<Building[]>(() => {
    const rng = mulberry32(20260616);
    const rows = [
      { z: -5, n: 18 },
      { z: 0, n: 16 },
      { z: 5, n: 20 },
    ];
    const out: Building[] = [];
    const spread = 36;
    for (const row of rows) {
      for (let i = 0; i < row.n; i++) {
        const w = 0.7 + rng() * 0.9;
        const h = 1.6 + rng() * 5.4;
        const d = 0.8 + rng() * 0.6;
        const x = -spread / 2 + (i / (row.n - 1)) * spread + (rng() - 0.5) * 1.4;
        // drop the skyline (size/heights unchanged) so the beam source clears the
        // rooftops and the projected M sits bright in open sky.
        out.push({ pos: [x, h / 2 - 3, row.z + (rng() - 0.5) * 1.4], scale: [w, h, d] });
      }
    }
    // beacon tower — the searchlight rises from its roof (centre, mid-depth); it
    // stands above the skyline so the beam clearly "comes from a building".
    out.push({ pos: [0, 9 / 2 - 3, 0], scale: [2.2, 9, 2.2] });
    return out;
  }, []);

  useEffect(() => {
    const city = cityRef.current;
    if (!city) return;
    const dummy = new THREE.Object3D();
    buildings.forEach((b, i) => {
      dummy.position.set(...b.pos);
      dummy.scale.set(...b.scale);
      dummy.updateMatrix();
      city.setMatrixAt(i, dummy.matrix);
    });
    city.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  return (
    <group>
      {/* Chanel pass (§14): the cheap planar reflection was removed — noir
          restraint + a small mobile-perf win. */}
      <instancedMesh ref={cityRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// Pointer parallax ±3° (lerped) — §5.1. Isolated so the mobile tier (no
// pointer) can skip the per-frame work entirely.
function Parallax({ group }: { group: React.RefObject<THREE.Group | null> }) {
  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.052;
    const targetX = -state.pointer.y * 0.03;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
  });
  return null;
}

// Mobile 30 fps cap: with frameloop="demand" the canvas renders only when
// invalidated; this rAF accumulator invalidates on a fixed cadence. Consistent
// frame pacing beats a thermally-throttled 45↔60 wobble on phones (§8 ≥30fps).
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last >= 1000 / fps) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);
  return null;
}

function Scene({
  frozen = false,
  parallax,
  signalScale,
  rainCount,
  coneSegments,
}: {
  frozen?: boolean;
  parallax: boolean;
  signalScale: [number, number, number];
  rainCount: number;
  coneSegments: [number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeWindowTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group ref={group}>
      {parallax && <Parallax group={group} />}
      <City texture={texture} />
      <Rain count={rainCount} />
      <Searchlight frozen={frozen} coneSegments={coneSegments} signalScale={signalScale} />
    </group>
  );
}

export default function CityScene({
  active,
  frozen = false,
  portrait = false,
  quality = DESKTOP_QUALITY,
  onCreated,
}: {
  active: boolean;
  frozen?: boolean;
  /** portrait framing — only ever true on the mobile tier / portrait poster capture */
  portrait?: boolean;
  quality?: HeroQuality;
  onCreated?: () => void;
}) {
  const cam = HERO_CAMERA[portrait ? "portrait" : "landscape"];
  const capped = quality.fpsCap !== null;
  return (
    <Canvas
      // desktop: always/never (unchanged). fps-capped tier: demand/never — the
      // FrameLimiter below drives invalidation at the capped cadence.
      frameloop={active ? (capped ? "demand" : "always") : "never"}
      camera={{ position: cam.position, fov: cam.fov }}
      gl={{
        antialias: quality.antialias,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={quality.dpr}
      onCreated={() => onCreated?.()}
    >
      <color attach="background" args={["#0b0e13"]} />
      <fog attach="fog" args={["#0b0e13", 8, 28]} />
      {capped && active && <FrameLimiter fps={quality.fpsCap!} />}
      <Scene
        frozen={frozen}
        parallax={quality.parallax}
        signalScale={SIGNAL_SCALE[portrait ? "portrait" : "landscape"]}
        rainCount={quality.rainCount}
        coneSegments={quality.coneSegments}
      />
    </Canvas>
  );
}
