"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Rain } from "@/components/hero/Rain";
import { Searchlight } from "@/components/hero/Searchlight";

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
      ctx.globalAlpha = lit ? 0.6 + rng() * 0.4 : 1;
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
        out.push({ pos: [x, h / 2, row.z + (rng() - 0.5) * 1.4], scale: [w, h, d] });
      }
    }
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

function Scene() {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeWindowTexture(), []);

  // pointer parallax ±3° (lerped) — §5.1
  useFrame((state) => {
    if (!group.current) return;
    const targetY = state.pointer.x * 0.052;
    const targetX = -state.pointer.y * 0.03;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
  });

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group ref={group}>
      <City texture={texture} />
      <Rain />
      <Searchlight />
    </group>
  );
}

export default function CityScene({
  active,
  onCreated,
}: {
  active: boolean;
  onCreated?: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 4, 18], fov: 50 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      onCreated={() => onCreated?.()}
    >
      <color attach="background" args={["#0b0e13"]} />
      <fog attach="fog" args={["#0b0e13", 8, 30]} />
      <Scene />
    </Canvas>
  );
}
