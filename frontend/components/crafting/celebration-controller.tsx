"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh } from "three";

import {
  craftingMotion,
  craftingPalette,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";

type CelebrationControllerProps = {
  paused: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
};

/** Animates Lumi from attentive witness to circling celebration and idle glow. */
export function CelebrationController({
  paused,
  phase,
  reducedMotion
}: CelebrationControllerProps) {
  const lumi = useRef<Group>(null);
  const leftWing = useRef<Mesh>(null);
  const rightWing = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!lumi.current || paused || reducedMotion) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const celebrating = phase === "celebrating";
    const orbiting = ["materializing", "celebrating"].includes(phase);
    const angle = elapsed * craftingMotion.lumiOrbitSpeed;
    lumi.current.position.x = orbiting ? Math.cos(angle) * craftingMotion.lumiOrbitRadius : -2.15;
    lumi.current.position.z = orbiting
      ? Math.sin(angle) * craftingMotion.lumiOrbitRadius * 0.45
      : 0.4;
    lumi.current.position.y = 1.85 + Math.sin(elapsed * craftingMotion.ingredientFloatSpeed) * 0.14;

    const wingBeat = celebrating
      ? Math.sin(
          elapsed * craftingMotion.particlePulseSpeed * craftingMotion.lumiClapSpeedMultiplier
        ) * 0.7
      : Math.sin(elapsed * craftingMotion.particlePulseSpeed) * 0.22;
    if (leftWing.current && rightWing.current) {
      leftWing.current.rotation.z = 0.45 + wingBeat;
      rightWing.current.rotation.z = -0.45 - wingBeat;
    }
    if (glow.current) {
      const glowScale =
        1 + Math.sin(elapsed * craftingMotion.particlePulseSpeed) * (celebrating ? 0.18 : 0.08);
      glow.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group position={[-2.15, 1.85, 0.4]} ref={lumi}>
      <mesh castShadow ref={glow}>
        <sphereGeometry args={[0.28, 20, 16]} />
        <meshStandardMaterial
          color={craftingPalette.lumi}
          emissive={craftingPalette.lumi}
          emissiveIntensity={phase === "celebrating" ? 3.2 : 1.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.27, 0, 0]} ref={leftWing} rotation={[0, 0, 0.45]}>
        <sphereGeometry args={[0.2, 12, 8]} />
        <meshStandardMaterial
          color={craftingPalette.lumiWing}
          emissive={craftingPalette.lumiWing}
          emissiveIntensity={1.1}
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh position={[0.27, 0, 0]} ref={rightWing} rotation={[0, 0, -0.45]}>
        <sphereGeometry args={[0.2, 12, 8]} />
        <meshStandardMaterial
          color={craftingPalette.lumiWing}
          emissive={craftingPalette.lumiWing}
          emissiveIntensity={1.1}
          transparent
          opacity={0.72}
        />
      </mesh>
      <pointLight
        color={craftingPalette.lumi}
        distance={5}
        intensity={phase === "celebrating" ? 5 : 2.4}
      />
    </group>
  );
}
