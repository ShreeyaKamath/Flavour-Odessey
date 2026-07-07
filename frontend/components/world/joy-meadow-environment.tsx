"use client";

import { Canvas } from "@react-three/fiber";

import { EnvironmentManager } from "@/components/world/environment-manager";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { joyMeadowLandmarks } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type JoyMeadowEnvironmentProps = {
  crafted: boolean;
  restored: boolean;
  paused: boolean;
  world: LivingWorldSnapshot;
};

/** Renders the lazy, performance-aware living Joy Meadow canvas. */
export function JoyMeadowEnvironment({
  crafted,
  paused,
  restored,
  world
}: JoyMeadowEnvironmentProps) {
  const reducedMotion = useMotionPreference();

  return (
    <div
      className="absolute inset-0 bg-accent/20"
      data-environment-ready="true"
      data-particles-paused={String(paused)}
      data-time-of-day={world.timeOfDay}
      data-weather={world.condition}
    >
      <Canvas
        camera={{ far: 50, fov: 48, near: 0.1, position: [0, 4.5, 10.5] }}
        className="h-full w-full"
        dpr={[1, 1.5]}
        fallback={<div className="h-full w-full bg-accent/20" />}
        frameloop={!paused && !reducedMotion ? "always" : "demand"}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ camera }) => camera.lookAt(0, 1.2, -1.5)}
        performance={{ min: 0.55 }}
        shadows
      >
        <EnvironmentManager
          crafted={crafted}
          paused={paused}
          reducedMotion={reducedMotion}
          restored={restored}
          world={world}
        />
      </Canvas>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 rounded-control border border-border/70 bg-background/75 px-3 py-2 text-xs font-semibold text-foreground shadow-panel backdrop-blur-sm"
      >
        {world.timeLabel} | {world.conditionLabel}
      </div>
      <p className="sr-only">
        A living Joy Meadow with a windmill, flowers, a bridge and river, berry bushes, an Ice Cream
        Tree, the Meadow Keeper house, a recipe shrine, and the Journal Tree.
      </p>
      <ul className="sr-only">
        {joyMeadowLandmarks.map((landmark) => (
          <li key={landmark.id}>{landmark.id.replaceAll("_", " ")}</li>
        ))}
      </ul>
    </div>
  );
}
