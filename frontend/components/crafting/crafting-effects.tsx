"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Points, PointsMaterial } from "three";

import {
  craftingCounts,
  craftingMotion,
  craftingPalette,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";
import { createSeededRandom } from "@/lib/world/scene-utils";

type CraftingEffectsProps = {
  paused: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
};

function createParticlePositions(count: number, seed: number, radius: number, height: number) {
  const random = createSeededRandom(seed);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = random() * Math.PI * 2;
    const distance = 0.35 + random() * radius;
    positions[index * 3] = Math.cos(angle) * distance;
    positions[index * 3 + 1] = random() * height;
    positions[index * 3 + 2] = Math.sin(angle) * distance;
  }
  return positions;
}

function ParticleCloud({
  active,
  color,
  count,
  paused,
  reducedMotion,
  seed,
  speed
}: {
  active: boolean;
  color: string;
  count: number;
  paused: boolean;
  reducedMotion: boolean;
  seed: number;
  speed: number;
}) {
  const points = useRef<Points>(null);
  const material = useRef<PointsMaterial>(null);
  const positions = useMemo(() => createParticlePositions(count, seed, 2.7, 3.4), [count, seed]);

  useFrame(({ clock }, delta) => {
    if (!points.current || paused || reducedMotion) {
      return;
    }
    points.current.rotation.y += delta * speed;
    points.current.position.y =
      Math.sin(clock.getElapsedTime() * craftingMotion.particlePulseSpeed) * 0.08;
    if (material.current) {
      material.current.opacity =
        0.58 + Math.sin(clock.getElapsedTime() * craftingMotion.particlePulseSpeed) * 0.2;
    }
  });

  if (!active) {
    return null;
  }

  return (
    <points frustumCulled={false} ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        depthWrite={false}
        opacity={0.76}
        ref={material}
        size={0.07}
        sizeAttenuation
        transparent
      />
    </points>
  );
}

function MagicCircle({
  active,
  paused,
  reducedMotion
}: {
  active: boolean;
  paused: boolean;
  reducedMotion: boolean;
}) {
  const circle = useRef<Group>(null);

  useFrame((_, delta) => {
    if (circle.current && !paused && !reducedMotion) {
      circle.current.rotation.z += delta * craftingMotion.runeRotationSpeed;
    }
  });

  if (!active) {
    return null;
  }

  return (
    <group position={[0, 0.06, 0]} ref={circle} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[1.65, 0.035, 8, 72]} />
        <meshStandardMaterial
          color={craftingPalette.magic}
          emissive={craftingPalette.magic}
          emissiveIntensity={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[1.18, 0.018, 8, 64]} />
        <meshStandardMaterial
          color={craftingPalette.goldenLight}
          emissive={craftingPalette.goldenLight}
          emissiveIntensity={1.4}
        />
      </mesh>
      {Array.from({ length: craftingCounts.runes }, (_, index) => {
        const angle = (index / craftingCounts.runes) * Math.PI * 2;
        return (
          <mesh
            key={angle}
            position={[Math.cos(angle) * 1.42, Math.sin(angle) * 1.42, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.18, 0.045, 0.025]} />
            <meshStandardMaterial
              color={craftingPalette.rune}
              emissive={craftingPalette.rune}
              emissiveIntensity={1.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RibbonParticles({
  active,
  paused,
  reducedMotion
}: {
  active: boolean;
  paused: boolean;
  reducedMotion: boolean;
}) {
  const ribbons = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ribbons.current && !paused && !reducedMotion) {
      ribbons.current.rotation.y += delta * craftingMotion.ribbonRotationSpeed;
    }
  });

  if (!active) {
    return null;
  }

  return (
    <group ref={ribbons}>
      {Array.from({ length: craftingCounts.ribbonSegments }, (_, index) => (
        <mesh
          key={index}
          position={[0, 0.75 + index * 0.45, 0]}
          rotation={[Math.PI / 2.6, index * 0.8, 0]}
        >
          <torusGeometry args={[1.25 - index * 0.14, 0.018, 6, 72, Math.PI * 1.55]} />
          <meshStandardMaterial
            color={index % 2 ? craftingPalette.magic : craftingPalette.ribbon}
            emissive={index % 2 ? craftingPalette.magic : craftingPalette.ribbon}
            emissiveIntensity={1.4}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Renders reusable circles, runes, dust, ribbons, sparkles, and confetti. */
export function CraftingEffects({ paused, phase, reducedMotion }: CraftingEffectsProps) {
  const active = !["selecting", "complete"].includes(phase);
  const materializing = ["materializing", "celebrating", "revealed"].includes(phase);
  const celebrating = ["celebrating", "revealed"].includes(phase);

  return (
    <>
      <MagicCircle active={active} paused={paused} reducedMotion={reducedMotion} />
      <RibbonParticles active={materializing} paused={paused} reducedMotion={reducedMotion} />
      <ParticleCloud
        active={active}
        color={craftingPalette.dust}
        count={craftingCounts.dust}
        paused={paused}
        reducedMotion={reducedMotion}
        seed={127}
        speed={craftingMotion.dustSpeed}
      />
      <ParticleCloud
        active={materializing}
        color={craftingPalette.goldenLight}
        count={craftingCounts.recipeSparkles}
        paused={paused}
        reducedMotion={reducedMotion}
        seed={191}
        speed={craftingMotion.ribbonRotationSpeed}
      />
      {craftingPalette.confetti.map((color, index) => (
        <ParticleCloud
          active={celebrating}
          color={color}
          count={craftingCounts.confetti / craftingPalette.confetti.length}
          key={color}
          paused={paused}
          reducedMotion={reducedMotion}
          seed={223 + index * 17}
          speed={craftingMotion.confettiSpeed + index * craftingMotion.confettiSpeedStep}
        />
      ))}
      <pointLight
        color={craftingPalette.goldenLight}
        distance={8}
        intensity={materializing ? 7 : active ? 3.5 : 1.5}
        position={[0, 1.4, 1]}
      />
    </>
  );
}
