"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

import { ParticleManager } from "@/components/world/particle-manager";
import {
  environmentCounts,
  environmentMotion,
  joyMeadowPalette
} from "@/lib/world/joy-meadow-config";

type WeatherRendererProps = {
  paused: boolean;
  reducedMotion: boolean;
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

/** Renders Joy Meadow's warm breeze, moving clouds, pollen, and leaves. */
export function WeatherRenderer({ paused, reducedMotion }: WeatherRendererProps) {
  const clouds = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!clouds.current || paused || reducedMotion) {
      return;
    }
    clouds.current.position.x += delta * environmentMotion.cloudSpeed;
    if (clouds.current.position.x > 7) {
      clouds.current.position.x = -7;
    }
  });

  return (
    <>
      <group ref={clouds}>
        {cloudPositions.slice(0, environmentCounts.clouds).map((position, index) => (
          <group key={position.join("-")} position={position}>
            <mesh scale={[1.4, 0.55, 0.7]}>
              <sphereGeometry args={[0.8, 16, 12]} />
              <meshStandardMaterial
                color={joyMeadowPalette.cloud}
                roughness={1}
                transparent
                opacity={0.88}
              />
            </mesh>
            <mesh position={[0.72, 0.03, 0]} scale={[0.9, 0.45, 0.6]}>
              <sphereGeometry args={[0.75, 16, 12]} />
              <meshStandardMaterial
                color={joyMeadowPalette.cloud}
                roughness={1}
                transparent
                opacity={0.82 - index * 0.025}
              />
            </mesh>
          </group>
        ))}
      </group>
      <ParticleManager
        count={environmentCounts.pollen}
        kind="wind"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        count={environmentCounts.leaves}
        kind="leaves"
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
