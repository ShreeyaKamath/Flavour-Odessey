"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Group } from "three";

import {
  environmentCounts,
  environmentMotion,
  joyMeadowPalette
} from "@/lib/world/joy-meadow-config";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type MeadowFaunaProps = {
  paused: boolean;
  reducedMotion: boolean;
  world: LivingWorldSnapshot;
};

function ButterflySwarm({ paused, reducedMotion, world }: MeadowFaunaProps) {
  const swarm = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!swarm.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime() * environmentMotion.butterflySpeed;
    swarm.current.position.x = Math.sin(elapsed) * 2.2;
    swarm.current.position.y =
      1.25 +
      Math.sin(elapsed * environmentMotion.butterflyVerticalFactor) *
        0.32 *
        (1 - world.rainIntensity * 0.7);
    swarm.current.position.z = Math.cos(elapsed * environmentMotion.beeOrbitSpeed) * 1.5;
    swarm.current.rotation.y = elapsed * environmentMotion.butterflyRotationSpeed;
  });

  if (world.rainIntensity > 0.75 || world.condition === "night") {
    return null;
  }

  return (
    <group position={[-1.6, 1.2, 0]} ref={swarm}>
      {Array.from({ length: environmentCounts.butterflies }, (_, index) => (
        <group
          key={index}
          position={[(index - 2) * 0.38, (index % 2) * 0.22, (index % 3) * 0.28]}
          scale={0.7 + (index % 2) * 0.2}
        >
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.45]}>
            <circleGeometry args={[0.11, 8]} />
            <meshBasicMaterial
              color={index % 2 ? joyMeadowPalette.flowerPink : joyMeadowPalette.flowerGold}
              side={DoubleSide}
            />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.45]}>
            <circleGeometry args={[0.11, 8]} />
            <meshBasicMaterial
              color={index % 2 ? joyMeadowPalette.flowerPink : joyMeadowPalette.flowerGold}
              side={DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BeeSwarm({ paused, reducedMotion, world }: MeadowFaunaProps) {
  const bees = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bees.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    bees.current.position.x = Math.cos(elapsed * environmentMotion.beeOrbitSpeed) * 1.1;
    bees.current.position.y = 0.9 + Math.sin(elapsed * environmentMotion.beeBobSpeed) * 0.15;
  });

  if (world.rainIntensity > 0.45 || world.condition === "night") {
    return null;
  }

  return (
    <group position={[3.4, 1, 1]} ref={bees}>
      {Array.from({ length: environmentCounts.bees }, (_, index) => (
        <group key={index} position={[index * 0.3, (index % 2) * 0.18, index * -0.16]}>
          <mesh scale={[1.4, 0.75, 0.75]}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshStandardMaterial color={joyMeadowPalette.flowerGold} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.075, 8]} />
            <meshBasicMaterial color={joyMeadowPalette.flowerWhite} opacity={0.65} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SprinkleBirds({ paused, reducedMotion, world }: MeadowFaunaProps) {
  const birds = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!birds.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime() * environmentMotion.birdSpeed;
    birds.current.position.x = Math.sin(elapsed) * 5;
    birds.current.position.y = 4.6 + Math.sin(elapsed * environmentMotion.birdBobFactor) * 0.18;
  });

  if (world.condition === "rain" || world.condition === "night" || world.condition === "mist") {
    return null;
  }

  return (
    <group position={[0, 4.6, -6]} ref={birds}>
      {Array.from({ length: environmentCounts.birds }, (_, index) => (
        <group key={index} position={[index * 0.7, (index % 2) * 0.25, index * -0.3]}>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.22, 0.025, 0.04]} />
            <meshBasicMaterial color={joyMeadowPalette.flowerWhite} />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.22, 0.025, 0.04]} />
            <meshBasicMaterial color={joyMeadowPalette.flowerWhite} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Animates butterflies, bees, and small birds across Joy Meadow. */
export function MeadowFauna(props: MeadowFaunaProps) {
  return (
    <>
      <ButterflySwarm {...props} />
      <BeeSwarm {...props} />
      <SprinkleBirds {...props} />
    </>
  );
}
