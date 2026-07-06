"use client";

import { AnimatedWater } from "@/components/world/animated-water";
import { CameraController } from "@/components/world/camera-controller";
import { JoyMeadowLandmarks } from "@/components/world/joy-meadow-landmarks";
import { LightingController } from "@/components/world/lighting-controller";
import { MeadowFauna } from "@/components/world/meadow-fauna";
import { MeadowFlora } from "@/components/world/meadow-flora";
import { ParallaxManager } from "@/components/world/parallax-manager";
import { ParticleManager } from "@/components/world/particle-manager";
import { WeatherRenderer } from "@/components/world/weather-renderer";
import { environmentCounts, joyMeadowPalette, type TimeOfDay } from "@/lib/world/joy-meadow-config";

type EnvironmentManagerProps = {
  crafted: boolean;
  paused: boolean;
  reducedMotion: boolean;
  restored: boolean;
  timeOfDay: TimeOfDay;
};

function MeadowTerrain({ paused, reducedMotion }: { paused: boolean; reducedMotion: boolean }) {
  return (
    <>
      <mesh receiveShadow position={[0, -0.28, -1]}>
        <cylinderGeometry args={[8.5, 8.8, 0.55, 48]} />
        <meshStandardMaterial color={joyMeadowPalette.grass} roughness={0.96} />
      </mesh>
      <ParallaxManager paused={paused} position={[0, 0, -8]} reducedMotion={reducedMotion}>
        {[-6, -3, 0, 3, 6].map((x, index) => (
          <mesh key={x} position={[x, 1.2 + (index % 2) * 0.35, -2]}>
            <sphereGeometry args={[2.4, 18, 12]} />
            <meshStandardMaterial
              color={index % 2 ? joyMeadowPalette.hill : joyMeadowPalette.hillFar}
              roughness={1}
            />
          </mesh>
        ))}
      </ParallaxManager>
    </>
  );
}

/** Composes the reusable Joy Meadow world renderers inside the R3F canvas. */
export function EnvironmentManager({
  crafted,
  paused,
  reducedMotion,
  restored,
  timeOfDay
}: EnvironmentManagerProps) {
  const night = timeOfDay === "night";

  return (
    <>
      <LightingController timeOfDay={timeOfDay} />
      <CameraController paused={paused} reducedMotion={reducedMotion} />
      <MeadowTerrain paused={paused} reducedMotion={reducedMotion} />
      <AnimatedWater paused={paused} reducedMotion={reducedMotion} />
      <MeadowFlora paused={paused} reducedMotion={reducedMotion} restored={restored} />
      <JoyMeadowLandmarks paused={paused} reducedMotion={reducedMotion} restored={restored} />
      <WeatherRenderer paused={paused} reducedMotion={reducedMotion} />
      <MeadowFauna paused={paused} reducedMotion={reducedMotion} />
      <ParticleManager
        count={environmentCounts.magicParticles}
        kind="magic"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={restored}
        count={environmentCounts.flowerParticles}
        kind="flowers"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={night}
        count={environmentCounts.fireflies}
        kind="fireflies"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={crafted}
        count={environmentCounts.recipeParticles}
        kind="recipe"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={restored}
        count={environmentCounts.restorationParticles}
        kind="restoration"
        paused={paused}
        reducedMotion={reducedMotion}
      />
      <ParticleManager
        active={restored}
        count={environmentCounts.sparkles}
        kind="sparkles"
        paused={paused}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
