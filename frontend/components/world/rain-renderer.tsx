"use client";

import { ParticleManager } from "@/components/world/particle-manager";
import { environmentCounts } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type RainRendererProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

/** Renders lightweight rain particles only while rainy weather is active. */
export function RainRenderer({ paused, reducedMotion, world }: RainRendererProps) {
  return (
    <ParticleManager
      active={world.rainIntensity > 0}
      count={Math.max(0, Math.round(environmentCounts.rain * world.rainIntensity))}
      kind="rain"
      paused={paused}
      reducedMotion={reducedMotion}
    />
  );
}
