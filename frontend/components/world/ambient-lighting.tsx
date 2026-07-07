"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { ACESFilmicToneMapping, Color, Fog, SRGBColorSpace } from "three";

import { lightingPresets } from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type AmbientLightingProps = {
  world: LivingWorldSnapshot;
};

/** Interpolates Joy Meadow lighting, fog, exposure, and color grading from time and weather. */
export function AmbientLighting({ world }: AmbientLightingProps) {
  const { gl, scene } = useThree();
  const preset = lightingPresets[world.timeOfDay];
  const fogNear = 10 + (1 - world.fogDensity) * 5;
  const fogFar = 20 + (1 - world.fogDensity) * 14;

  useEffect(() => {
    scene.background = new Color(world.skyTop);
    scene.fog = new Fog(world.ambientColor, fogNear, fogFar);
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = preset.exposure * (0.74 + world.lightingBlend * 0.28);
  }, [fogFar, fogNear, gl, preset.exposure, scene, world]);

  return (
    <>
      <ambientLight color={world.ambientColor} intensity={preset.ambientIntensity * 0.86} />
      <hemisphereLight
        color={preset.skyGlow}
        groundColor={world.ambientColor}
        intensity={preset.ambientIntensity * 0.58}
      />
      <directionalLight
        castShadow
        color={preset.keyColor}
        intensity={preset.keyIntensity * (0.62 + world.lightingBlend * 0.34)}
        position={preset.keyPosition}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <mesh position={[preset.keyPosition[0], preset.keyPosition[1], -10]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial
          color={preset.skyGlow}
          opacity={0.44 + world.lightingBlend * 0.34}
          transparent
        />
      </mesh>
      <mesh position={[preset.keyPosition[0], preset.keyPosition[1], -10]}>
        <sphereGeometry args={[1.45, 24, 24]} />
        <meshBasicMaterial color={preset.skyGlow} depthWrite={false} opacity={0.1} transparent />
      </mesh>
    </>
  );
}
