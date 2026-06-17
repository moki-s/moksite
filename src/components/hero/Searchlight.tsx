"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// §5.1 — narrow amber cone, additive blending, slow 12 s sweep pointing at empty
// sky. §15 — it projects NO logo or emblem (it is only a cone of light).
export function Searchlight() {
  const pivot = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!pivot.current) return;
    const t = state.clock.elapsedTime;
    pivot.current.rotation.z = Math.sin((t / 12) * Math.PI * 2) * 0.5;
  });

  return (
    <group ref={pivot} position={[7, 0.5, -4]}>
      {/* cone tip at the source (bottom), widening up into the sky */}
      <mesh position={[0, 7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[3.6, 14, 32, 1, true]} />
        <meshBasicMaterial
          color="#f5a623"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
