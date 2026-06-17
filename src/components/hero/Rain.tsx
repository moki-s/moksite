"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// §5.1 / §8 — GPU-instanced rain, ≤ 400 short segments, opacity 0.25, cycling
// downward. One InstancedMesh; matrices updated per frame.
const COUNT = 400;

export function Rain() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 44,
        y: Math.random() * 26,
        z: (Math.random() - 0.5) * 18,
        speed: 9 + Math.random() * 9,
      })),
    [],
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
    for (let i = 0; i < COUNT; i++) {
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
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.015, 0.55, 0.015]} />
      <meshBasicMaterial color="#8a93a6" transparent opacity={0.25} toneMapped={false} />
    </instancedMesh>
  );
}
