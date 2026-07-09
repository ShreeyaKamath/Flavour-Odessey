"use client";

import type { LivingWorldSnapshot } from "@/lib/world/weather-system";
import { useAssetTexture } from "@/components/world/use-asset-texture";

type SkyRendererProps = {
  world: LivingWorldSnapshot;
};

/** Paints a lightweight gradient sky plane from the active weather and time state. */
export function SkyRenderer({ world }: SkyRendererProps) {
  const { texture: skyTexture } = useAssetTexture("environment.sky", "far");

  return (
    <group position={[0, 4.2, -14]}>
      <mesh scale={[16, 7.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={world.skyTop} depthWrite={false} map={skyTexture ?? undefined} />
      </mesh>
      <mesh position={[0, -2.45, 0.02]} scale={[16, 3.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={world.skyBottom} depthWrite={false} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}
