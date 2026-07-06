"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

import { environmentMotion, joyMeadowPalette } from "@/lib/world/joy-meadow-config";

type AnimatedWaterProps = {
  paused: boolean;
  reducedMotion: boolean;
};

/** Renders a gently animated river with moving highlight ribbons. */
export function AnimatedWater({ paused, reducedMotion }: AnimatedWaterProps) {
  const river = useRef<Mesh>(null);
  const highlights = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    if (river.current) {
      river.current.position.y =
        0.035 +
        Math.sin(elapsed * environmentMotion.waterSpeed) * environmentMotion.waterBobAmplitude;
      const material = river.current.material as MeshStandardMaterial;
      material.opacity = 0.78 + Math.sin(elapsed * environmentMotion.waterOpacitySpeed) * 0.06;
    }
    if (highlights.current) {
      highlights.current.position.z += delta * environmentMotion.waterHighlightSpeed;
      if (highlights.current.position.z > 2) {
        highlights.current.position.z = -2;
      }
    }
  });

  return (
    <group position={[1.5, 0, -1.2]} rotation={[0, 0.05, 0]}>
      <mesh receiveShadow ref={river} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.35, 15, 8, 24]} />
        <meshStandardMaterial
          color={joyMeadowPalette.river}
          metalness={0.08}
          opacity={0.82}
          roughness={0.2}
          transparent
        />
      </mesh>
      <group ref={highlights}>
        {[-4.5, -1.2, 2.2, 5].map((z, index) => (
          <mesh
            key={z}
            position={[index % 2 === 0 ? -0.4 : 0.45, 0.055, z]}
            rotation={[-Math.PI / 2, 0, index % 2 === 0 ? 0.08 : -0.08]}
          >
            <planeGeometry args={[0.65, 0.055]} />
            <meshBasicMaterial color={joyMeadowPalette.riverHighlight} opacity={0.58} transparent />
          </mesh>
        ))}
      </group>
    </group>
  );
}
