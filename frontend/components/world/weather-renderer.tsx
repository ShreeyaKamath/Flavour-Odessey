import { CloudRenderer } from "@/components/world/cloud-renderer";
import { FogRenderer } from "@/components/world/fog-renderer";
import { ParticleManager } from "@/components/world/particle-manager";
import { RainRenderer } from "@/components/world/rain-renderer";
import { WindSystem } from "@/components/world/wind-system";
import { environmentCounts } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type WeatherRendererProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

/** Composes Joy Meadow's active weather renderers. */
export function WeatherRenderer({ paused, reducedMotion, world }: WeatherRendererProps) {
  return (
    <>
      <CloudRenderer paused={paused} reducedMotion={reducedMotion} world={world} />
      <WindSystem paused={paused} reducedMotion={reducedMotion} world={world} />
      <RainRenderer paused={paused} reducedMotion={reducedMotion} world={world} />
      <FogRenderer world={world} />
      <ParticleManager
        active={world.condition === "mist"}
        count={environmentCounts.mist}
        kind="mist"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={world.condition === "golden_hour"}
        count={Math.round(environmentCounts.sparkles * 0.7)}
        kind="sparkles"
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
