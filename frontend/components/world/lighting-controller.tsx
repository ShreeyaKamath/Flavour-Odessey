"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { ACESFilmicToneMapping, Color, Fog, SRGBColorSpace } from "three";

import { lightingPresets, type TimeOfDay } from "@/lib/world/joy-meadow-config";

type LightingControllerProps = {
  timeOfDay: TimeOfDay;
};

/** Applies time-aware lighting, fog, exposure, and soft sky glow. */
export function LightingController({ timeOfDay }: LightingControllerProps) {
  const { gl, scene } = useThree();
  const preset = lightingPresets[timeOfDay];

  useEffect(() => {
    scene.background = new Color(preset.background);
    scene.fog = new Fog(preset.fog, 13, 32);
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = preset.exposure;
  }, [gl, preset, scene]);

  return (
    <>
      <ambientLight color={preset.ambientColor} intensity={preset.ambientIntensity} />
      <hemisphereLight
        color={preset.skyGlow}
        groundColor={preset.fog}
        intensity={preset.ambientIntensity * 0.7}
      />
      <directionalLight
        castShadow
        color={preset.keyColor}
        intensity={preset.keyIntensity}
        position={preset.keyPosition}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <mesh position={[preset.keyPosition[0], preset.keyPosition[1], -10]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshBasicMaterial color={preset.skyGlow} transparent opacity={0.78} />
      </mesh>
      <mesh position={[preset.keyPosition[0], preset.keyPosition[1], -10]}>
        <sphereGeometry args={[1.45, 24, 24]} />
        <meshBasicMaterial color={preset.skyGlow} depthWrite={false} transparent opacity={0.12} />
      </mesh>
    </>
  );
}
