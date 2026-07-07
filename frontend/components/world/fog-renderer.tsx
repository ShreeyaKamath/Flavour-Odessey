"use client";

import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type FogRendererProps = {
  world: LivingWorldSnapshot;
};

/** Adds soft layered fog planes without heavy shaders. */
export function FogRenderer({ world }: FogRendererProps) {
  if (world.fogDensity <= 0.03) {
    return null;
  }

  return (
    <group position={[0, 0.35, -4.8]}>
      {[0, 1, 2].map((layer) => (
        <mesh key={layer} position={[0, layer * 0.55, layer * 1.8]} scale={[13, 1.8, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={world.ambientColor}
            depthWrite={false}
            opacity={world.fogDensity * (0.16 - layer * 0.028)}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}
