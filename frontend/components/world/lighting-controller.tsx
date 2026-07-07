"use client";

import { AmbientLighting } from "@/components/world/ambient-lighting";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type LightingControllerProps = {
  world: LivingWorldSnapshot;
};

/** Backwards-compatible wrapper around the Phase 15 ambient lighting system. */
export function LightingController({ world }: LightingControllerProps) {
  return <AmbientLighting world={world} />;
}
