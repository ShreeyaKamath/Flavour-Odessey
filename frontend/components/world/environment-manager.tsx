"use client";

import { AnimatedWater } from "@/components/world/animated-water";
import { CameraController } from "@/components/world/camera-controller";
import { FireflyController } from "@/components/world/firefly-controller";
import { JoyMeadowLandmarks } from "@/components/world/joy-meadow-landmarks";
import { LightingController } from "@/components/world/lighting-controller";
import { MeadowFauna } from "@/components/world/meadow-fauna";
import { MeadowFlora } from "@/components/world/meadow-flora";
import { ParallaxManager } from "@/components/world/parallax-manager";
import { ParticleManager } from "@/components/world/particle-manager";
import { SkyRenderer } from "@/components/world/sky-renderer";
import { useAssetTexture } from "@/components/world/use-asset-texture";
import { WeatherRenderer } from "@/components/world/weather-renderer";
import { environmentCounts, joyMeadowPalette } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type EnvironmentManagerProps = {
  crafted: boolean;
  paused: boolean;
  reducedMotion: boolean;
  restored: boolean;
  world: LivingWorldSnapshot;
};

function MeadowTerrain({
  paused,
  reducedMotion,
  world
}: {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
}) {
  const { texture: meadowTexture } = useAssetTexture("environment.meadow_background");

  return (
    <>
      <mesh receiveShadow position={[0, -0.28, -1]}>
        <cylinderGeometry args={[8.5, 8.8, 0.55, 48]} />
        <meshStandardMaterial
          color={world.condition === "rain" ? joyMeadowPalette.grassDark : joyMeadowPalette.grass}
          map={meadowTexture ?? undefined}
          roughness={0.96}
        />
      </mesh>
      <ParallaxManager paused={paused} position={[0, 0, -8]} reducedMotion={reducedMotion}>
        {[-6, -3, 0, 3, 6].map((x, index) => (
          <mesh key={x} position={[x, 1.2 + (index % 2) * 0.35, -2]}>
            <sphereGeometry args={[2.4, 18, 12]} />
            <meshStandardMaterial
              color={index % 2 ? joyMeadowPalette.hill : joyMeadowPalette.hillFar}
              map={meadowTexture ?? undefined}
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
  world
}: EnvironmentManagerProps) {
  return (
    <>
      <SkyRenderer world={world} />
      <LightingController world={world} />
      <CameraController paused={paused} reducedMotion={reducedMotion} />
      <MeadowTerrain paused={paused} reducedMotion={reducedMotion} world={world} />
      <AnimatedWater paused={paused} reducedMotion={reducedMotion} world={world} />
      <MeadowFlora
        paused={paused}
        reducedMotion={reducedMotion}
        restored={restored}
        world={world}
      />
      <JoyMeadowLandmarks paused={paused} reducedMotion={reducedMotion} restored={restored} />
      <WeatherRenderer paused={paused} reducedMotion={reducedMotion} world={world} />
      <MeadowFauna paused={paused} reducedMotion={reducedMotion} world={world} />
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
      <FireflyController paused={paused} reducedMotion={reducedMotion} world={world} />
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
