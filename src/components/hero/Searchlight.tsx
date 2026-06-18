"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// §5.1 / §15 (amended — see DECISIONS.md): a single amber shaft of light rising
// from the beacon tower's roof, projecting an ORIGINAL "M" monogram (the owner's
// initial) as a negative-space stencil in the upper sky — no franchise emblem,
// no shield/lockup. §4: the one dominant warm light.

const SIGNAL = "#f5a623";

// Vertical brightness gradient for the beam: opaque at the source (tower roof),
// fading to transparent up into the sky → reads as a real shaft of light.
function makeBeamTexture(): THREE.CanvasTexture {
  const w = 4;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, h, 0, 0); // bottom (source) → top
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.55, "rgba(255,255,255,0.55)");
  g.addColorStop(0.85, "rgba(255,255,255,0.18)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// Soft vertical band with a clean geometric "M" carved out (destination-out) →
// negative space. Bare strokes only, no enclosing shape (§15).
function makeSignalTexture(): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const v = ctx.createLinearGradient(0, 0, 0, s);
  v.addColorStop(0, "rgba(255,255,255,0)");
  v.addColorStop(0.5, "rgba(255,255,255,1)");
  v.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, s, s);
  const hgrad = ctx.createLinearGradient(0, 0, s, 0);
  hgrad.addColorStop(0, "rgba(0,0,0,0)");
  hgrad.addColorStop(0.5, "rgba(0,0,0,1)");
  hgrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = hgrad;
  ctx.fillRect(0, 0, s, s);
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = s * 0.14;
  ctx.lineJoin = "miter";
  ctx.lineCap = "butt";
  const xL = s * 0.31,
    xR = s * 0.69,
    yTop = s * 0.33,
    yBot = s * 0.67,
    xMid = s * 0.5,
    yMid = s * 0.55;
  ctx.beginPath();
  ctx.moveTo(xL, yBot);
  ctx.lineTo(xL, yTop);
  ctx.lineTo(xMid, yMid);
  ctx.lineTo(xR, yTop);
  ctx.lineTo(xR, yBot);
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

// Eased oscillation with edge dwell — lingers at the arc extremes (hypnotic).
function edgeDwell(phase: number): number {
  const tri = 1 - Math.abs(2 * (phase - Math.floor(phase)) - 1);
  const s = tri * tri * tri * (tri * (tri * 6 - 15) + 10);
  return s * 2 - 1;
}

const PERIOD = 14; // s
const ARC = 0.4; // rad — half-swing
const FROZEN_SWING = 0.14; // poster: near-vertical

// pivot sits on the beacon-tower roof (centre): tower h=8 at base y=-3 → roof y=5.
export function Searchlight({ frozen = false }: { frozen?: boolean }) {
  const pivot = useRef<THREE.Group>(null);
  const signal = useRef<THREE.Sprite>(null);
  const beam = useMemo(() => makeBeamTexture(), []);
  const tex = useMemo(() => makeSignalTexture(), []);
  useEffect(() => {
    return () => {
      beam.dispose();
      tex.dispose();
    };
  }, [beam, tex]);

  const setSignal = (v: number) => {
    if (signal.current) (signal.current.material as THREE.SpriteMaterial).opacity = v;
  };

  useFrame((state) => {
    const p = pivot.current;
    if (!p) return;
    if (frozen) {
      p.rotation.z = FROZEN_SWING;
      setSignal(0.6);
      return;
    }
    const phase = (state.clock.elapsedTime / PERIOD) % 1;
    const swing = edgeDwell(phase) * ARC;
    p.rotation.z = swing;
    setSignal(0.2 + Math.min(1, Math.abs(swing) / ARC) * 0.4);
  });

  return (
    <group ref={pivot} position={[0, 6, 0]}>
      {/* defined shaft — short + wide cones so the beam spreads in-frame; the
          gradient makes it brightest at the tower roof, fading into the sky. */}
      <mesh position={[0, 4.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.8, 9, 48, 1, true]} />
        <meshBasicMaterial
          map={beam}
          color={SIGNAL}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 4.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[5, 9, 36, 1, true]} />
        <meshBasicMaterial
          map={beam}
          color={SIGNAL}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* projected "M" — upper-centre, in the beam, carved as negative space */}
      <sprite ref={signal} position={[0, 1.5, 0]} scale={[4.5, 5, 1]}>
        <spriteMaterial
          map={tex}
          color={SIGNAL}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}
