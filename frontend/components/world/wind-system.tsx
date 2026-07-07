"use client";

import { ParticleManager } from "@/components/world/particle-manager";
import { environmentCounts } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type WindSystemProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

/** Renders wind pollen and drifting leaves according to the active weather strength. */
export function WindSystem({ paused, reducedMotion, world }: WindSystemProps) {
  return (
    <>
      <ParticleManager
        count={Math.max(12, Math.round(environmentCounts.pollen * world.windStrength))}
        kind="wind"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        count={Math.max(8, Math.round(environmentCounts.leaves * world.windStrength))}
        kind="leaves"
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
