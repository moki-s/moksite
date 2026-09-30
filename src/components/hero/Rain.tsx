"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// §5.1 / §8 — GPU-instanced rain, ≤ 400 short segments (the cap), cycling
// downward. One InstancedMesh; matrices updated per frame. Intensity (length +
// opacity) bumped for drama; segment count stays within the 400 budget.
// `count` defaults to the desktop value; the mobile hero tier passes 200.
export function Rain({ count = 400 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 44,
        y: Math.random() * 26,
        z: (Math.random() - 0.5) * 18,
        speed: 9 + Math.random() * 9,
      })),
    [count],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    drops.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [drops, dummy]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const step = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const d = drops[i];
      d.y -= d.speed * step;
      if (d.y < -2) d.y = 26;
      dummy.position.set(d.x, d.y, d.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      key={count}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.015, 0.68, 0.015]} />
      <meshBasicMaterial color="#8a93a6" transparent opacity={0.3} toneMapped={false} />
    </instancedMesh>
  );
}
