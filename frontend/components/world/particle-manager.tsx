"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Points, PointsMaterial } from "three";

import {
  environmentMotion,
  particlePresets,
  type ParticleKind
} from "@/lib/world/joy-meadow-config";
import { createSeededRandom } from "@/lib/world/scene-utils";

type ParticleManagerProps = {
  active?: boolean;
  count: number;
  kind: ParticleKind;
  paused: boolean;
  reducedMotion: boolean;
};

const particleSeeds: Record<ParticleKind, number> = {
  fireflies: 61,
  flowers: 29,
  leaves: 43,
  magic: 47,
  recipe: 53,
  restoration: 59,
  sparkles: 37,
  wind: 23
};

/** Renders a reusable, visibility-aware point-particle layer. */
export function ParticleManager({
  active = true,
  count,
  kind,
  paused,
  reducedMotion
}: ParticleManagerProps) {
  const points = useRef<Points>(null);
  const material = useRef<PointsMaterial>(null);
  const preset = particlePresets[kind];
  const positions = useMemo(() => {
    const random = createSeededRandom(particleSeeds[kind]);
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (random() - 0.5) * 13;
      values[index * 3 + 1] = 0.45 + random() * 5.2;
      values[index * 3 + 2] = -7 + random() * 12;
    }
    return values;
  }, [count, kind]);

  useFrame(({ clock }, delta) => {
    if (!points.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    points.current.rotation.y += delta * preset.speed * environmentMotion.particleRotationFactor;
    points.current.position.x = Math.sin(elapsed * preset.speed) * 0.22;
    points.current.position.y =
      Math.sin(elapsed * preset.speed * environmentMotion.particleVerticalFactor) * 0.08;
    if (material.current && (kind === "fireflies" || kind === "sparkles")) {
      material.current.opacity =
        preset.opacity * (0.72 + Math.sin(elapsed * environmentMotion.particlePulseSpeed) * 0.22);
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
        color={preset.color}
        depthWrite={false}
        opacity={preset.opacity}
        ref={material}
        size={preset.size}
        sizeAttenuation
        transparent
      />
    </points>
  );
}
