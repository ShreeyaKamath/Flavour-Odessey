"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

import { environmentCounts, environmentMotion } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type CloudRendererProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

const cloudPositions = [
  [-7, 5.2, -9],
  [-3.8, 6.1, -11],
  [-0.5, 5.5, -10],
  [3.2, 6.3, -12],
  [6.5, 5.4, -9],
  [9.2, 6.5, -11],
  [12.5, 5.8, -10]
] as const;

/** Renders weather-aware cloud cover with wind-driven drift. */
export function CloudRenderer({ paused, reducedMotion, world }: CloudRendererProps) {
  const clouds = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!clouds.current || paused || reducedMotion) {
      return;
    }
    clouds.current.position.x += delta * environmentMotion.cloudSpeed * (0.75 + world.windStrength);
    if (clouds.current.position.x > 7) {
      clouds.current.position.x = -7;
    }
  });

  return (
    <group ref={clouds}>
      {cloudPositions.slice(0, environmentCounts.clouds).map((position, index) => (
        <group key={position.join("-")} position={position}>
          <mesh scale={[1.4 + world.cloudCover * 0.6, 0.55, 0.7]}>
            <sphereGeometry args={[0.8, 16, 12]} />
            <meshStandardMaterial
              color={world.condition === "rain" ? "#cbd7df" : "#fff7e8"}
              opacity={0.42 + world.cloudCover * 0.48}
              roughness={1}
              transparent
            />
          </mesh>
          <mesh position={[0.72, 0.03, 0]} scale={[0.9 + world.cloudCover * 0.45, 0.45, 0.6]}>
            <sphereGeometry args={[0.75, 16, 12]} />
            <meshStandardMaterial
              color={world.condition === "rain" ? "#b8c8d2" : "#fff7e8"}
              opacity={0.38 + world.cloudCover * 0.42 - index * 0.018}
              roughness={1}
              transparent
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
