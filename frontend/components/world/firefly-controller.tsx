"use client";

import { ParticleManager } from "@/components/world/particle-manager";
import { environmentCounts } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type FireflyControllerProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

/** Controls evening and night firefly density from the living weather snapshot. */
export function FireflyController({ paused, reducedMotion, world }: FireflyControllerProps) {
  return (
    <ParticleManager
      active={world.fireflyIntensity > 0}
      count={Math.max(0, Math.round(environmentCounts.fireflies * world.fireflyIntensity))}
      kind="fireflies"
      paused={paused}
      reducedMotion={reducedMotion}
    />
  );
}
