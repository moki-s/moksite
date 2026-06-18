"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// §5.1 / §15 (amended — see DECISIONS.md): a single amber shaft of light that
// projects an ORIGINAL "M" monogram (the owner's initial) as a faint negative-space
// stencil — no franchise emblem, no shield/circle, no logo lockup. The beam is
// nested additive cones (a solid-reading shaft that falls off through the scene
// fog); the M is a gobo (a soft amber band with the letter carved out, so it reads
// as the *absence* of light, not a glowing glyph). §4: this is the one dominant
// warm light — the city emissive is dimmed so the beam stays the focus.

const SIGNAL = "#f5a623";

// Soft vertical light band with a clean geometric "M" carved out (destination-out)
// → negative space. Bare strokes only: two verticals + a centre V, no enclosing
// shape, so it reads as a projected letter, not a badge. Drawn at runtime — no
// downloaded asset (§8).
function makeSignalTexture(): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;

  // soft vertical band (reads as a segment of the beam, not a disc/badge)
  const v = ctx.createLinearGradient(0, 0, 0, s);
  v.addColorStop(0, "rgba(255,255,255,0)");
  v.addColorStop(0.5, "rgba(255,255,255,1)");
  v.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, s, s);
  const h = ctx.createLinearGradient(0, 0, s, 0);
  h.addColorStop(0, "rgba(0,0,0,0)");
  h.addColorStop(0.5, "rgba(0,0,0,1)");
  h.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, s, s);

  // carve the bare "M" out of the band → negative space
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

// Eased oscillation with edge dwell: a triangle wave shaped by smootherstep, so the
// beam decelerates and lingers at the extremes of its arc (hypnotic), not a linear
// sweep. Returns -1..1.
function edgeDwell(phase: number): number {
  const tri = 1 - Math.abs(2 * (phase - Math.floor(phase)) - 1);
  const s = tri * tri * tri * (tri * (tri * 6 - 15) + 10);
  return s * 2 - 1;
}

const PERIOD = 14; // s — slow, hypnotic loop
const ARC = 0.55; // rad — half-swing of the beam
const FROZEN_SWING = 0.18; // poster: a near-vertical clean shaft

export function Searchlight({ frozen = false }: { frozen?: boolean }) {
  const pivot = useRef<THREE.Group>(null);
  const signal = useRef<THREE.Sprite>(null);
  const tex = useMemo(() => makeSignalTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);

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
    // the M reads strongest where the beam crests (extremes of the arc)
    const crest = Math.min(1, Math.abs(swing) / ARC);
    setSignal(0.16 + crest * 0.4);
  });

  return (
    <group ref={pivot} position={[5, 6, -1]}>
      {/* nested cones, tip at the source (bottom) widening up into the sky.
          core = bright shaft; mid + outer = volumetric falloff. */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.4, 14, 48, 1, true]} />
        <meshBasicMaterial
          color={SIGNAL}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.8, 14, 40, 1, true]} />
        <meshBasicMaterial
          color={SIGNAL}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[4.3, 14, 32, 1, true]} />
        <meshBasicMaterial
          color={SIGNAL}
          transparent
          opacity={0.035}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* the projected "M" — high in the beam, billboarded, carved as negative space */}
      <sprite ref={signal} position={[0, 1.2, 0]} scale={[4.5, 5, 1]}>
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
