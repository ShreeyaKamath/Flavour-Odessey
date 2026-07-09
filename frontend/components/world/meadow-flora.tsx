"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Group, InstancedMesh, Object3D, type Texture } from "three";

import { useAssetTexture } from "@/components/world/use-asset-texture";
import {
  environmentCounts,
  environmentMotion,
  joyMeadowBushPositions,
  joyMeadowPalette,
  joyMeadowTreePositions
} from "@/lib/world/joy-meadow-config";
import { generateFieldPositions } from "@/lib/world/scene-utils";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type MeadowFloraProps = {
  paused: boolean;
  reducedMotion: boolean;
  restored: boolean;
  world: LivingWorldSnapshot;
};

function useFieldInstances(
  mesh: React.RefObject<InstancedMesh | null>,
  positions: ReturnType<typeof generateFieldPositions>,
  yOffset: number
) {
  useLayoutEffect(() => {
    if (!mesh.current) {
      return;
    }
    const transform = new Object3D();
    positions.forEach((position, index) => {
      transform.position.set(position.x, yOffset * position.scale, position.z);
      transform.rotation.set(0, position.rotation, position.rotation * 0.2);
      transform.scale.setScalar(position.scale);
      transform.updateMatrix();
      mesh.current?.setMatrixAt(index, transform.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [mesh, positions, yOffset]);
}

function GrassField({ paused, reducedMotion, world }: Omit<MeadowFloraProps, "restored">) {
  const grass = useRef<InstancedMesh>(null);
  const { texture: grassTexture } = useAssetTexture("environment.grass");
  const positions = useMemo(() => generateFieldPositions(environmentCounts.grass, 103, 14, 13), []);
  useFieldInstances(grass, positions, 0.18);

  useFrame(({ clock }) => {
    if (!grass.current || paused || reducedMotion) {
      return;
    }
    grass.current.rotation.z =
      Math.sin(clock.getElapsedTime() * environmentMotion.grassSwaySpeed) *
      environmentMotion.grassSwayAmplitude *
      world.grassSway;
  });

  return (
    <instancedMesh args={[undefined, undefined, positions.length]} receiveShadow ref={grass}>
      <coneGeometry args={[0.035, 0.38, 3]} />
      <meshStandardMaterial
        color={joyMeadowPalette.grassDark}
        map={grassTexture ?? undefined}
        roughness={0.9}
      />
    </instancedMesh>
  );
}

function FlowerPatch({
  color,
  flowerTexture,
  positions
}: {
  color: string;
  flowerTexture: Texture | null;
  positions: ReturnType<typeof generateFieldPositions>;
}) {
  const blooms = useRef<InstancedMesh>(null);
  useFieldInstances(blooms, positions, 0.38);

  return (
    <instancedMesh args={[undefined, undefined, positions.length]} castShadow ref={blooms}>
      <dodecahedronGeometry args={[0.095, 0]} />
      <meshStandardMaterial color={color} map={flowerTexture ?? undefined} roughness={0.72} />
    </instancedMesh>
  );
}

function FlowerField({ paused, reducedMotion, restored, world }: MeadowFloraProps) {
  const flowers = useRef<Group>(null);
  const stems = useRef<InstancedMesh>(null);
  const { texture: flowerTexture } = useAssetTexture("environment.flower");
  const positions = useMemo(
    () => generateFieldPositions(restored ? environmentCounts.flowers : 36, 211, 13, 11),
    [restored]
  );
  const groups = [
    positions.filter((_, index) => index % 3 === 0),
    positions.filter((_, index) => index % 3 === 1),
    positions.filter((_, index) => index % 3 === 2)
  ];
  useFieldInstances(stems, positions, 0.2);

  useFrame(({ clock }) => {
    if (!flowers.current || paused || reducedMotion) {
      return;
    }
    flowers.current.rotation.z =
      Math.sin(
        clock.getElapsedTime() *
          environmentMotion.grassSwaySpeed *
          environmentMotion.flowerSwayFactor
      ) *
      environmentMotion.grassSwayAmplitude *
      1.4 *
      world.flowerSway *
      (restored ? 1 : 0.82);
  });

  return (
    <group ref={flowers}>
      <instancedMesh args={[undefined, undefined, positions.length]} castShadow ref={stems}>
        <cylinderGeometry args={[0.018, 0.026, 0.4, 5]} />
        <meshStandardMaterial color={joyMeadowPalette.grassDark} roughness={0.9} />
      </instancedMesh>
      <FlowerPatch
        color={joyMeadowPalette.flowerGold}
        flowerTexture={flowerTexture}
        positions={groups[0]}
      />
      <FlowerPatch
        color={joyMeadowPalette.flowerPink}
        flowerTexture={flowerTexture}
        positions={groups[1]}
      />
      <FlowerPatch
        color={joyMeadowPalette.flowerWhite}
        flowerTexture={flowerTexture}
        positions={groups[2]}
      />
    </group>
  );
}

function StoryTree({
  position,
  scale = 1,
  treeTexture
}: {
  position: readonly [number, number, number];
  scale?: number;
  treeTexture: Texture | null;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.17, 0.28, 1.6, 7]} />
        <meshStandardMaterial
          color={joyMeadowPalette.bark}
          map={treeTexture ?? undefined}
          roughness={1}
        />
      </mesh>
      <mesh castShadow position={[0, 1.75, 0]}>
        <dodecahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial
          color={joyMeadowPalette.leaf}
          map={treeTexture ?? undefined}
          roughness={0.86}
        />
      </mesh>
      <mesh castShadow position={[0.45, 1.65, 0.05]} scale={0.72}>
        <dodecahedronGeometry args={[0.68, 1]} />
        <meshStandardMaterial
          color={joyMeadowPalette.leafLight}
          map={treeTexture ?? undefined}
          roughness={0.86}
        />
      </mesh>
    </group>
  );
}

function BerryBush({
  bushTexture,
  position
}: {
  bushTexture: Texture | null;
  position: readonly [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color={joyMeadowPalette.leaf}
          map={bushTexture ?? undefined}
          roughness={0.9}
        />
      </mesh>
      {(
        [
          [-0.18, 0.48, 0.25],
          [0.16, 0.4, 0.28],
          [0.05, 0.62, 0.08]
        ] as const
      ).map((berry) => (
        <mesh key={berry.join("-")} position={berry}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={joyMeadowPalette.berry} roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

/** Renders instanced grass, wind-swept flowers, trees, and berry bushes. */
export function MeadowFlora(props: MeadowFloraProps) {
  const trees = useRef<Group>(null);
  const { texture: bushTexture } = useAssetTexture("environment.berry_bush");
  const { texture: treeTexture } = useAssetTexture("environment.tree");

  useFrame(({ clock }) => {
    if (!trees.current || props.paused || props.reducedMotion) {
      return;
    }
    trees.current.rotation.z =
      Math.sin(clock.getElapsedTime() * environmentMotion.treeSwaySpeed) *
      environmentMotion.grassSwayAmplitude *
      0.35 *
      props.world.grassSway;
  });

  return (
    <>
      <GrassField paused={props.paused} reducedMotion={props.reducedMotion} world={props.world} />
      <FlowerField {...props} />
      <group ref={trees}>
        {joyMeadowTreePositions.map((position, index) => (
          <StoryTree
            key={position.join("-")}
            position={position}
            scale={0.85 + (index % 3) * 0.08}
            treeTexture={treeTexture}
          />
        ))}
      </group>
      {joyMeadowBushPositions.map((position) => (
        <BerryBush bushTexture={bushTexture} key={position.join("-")} position={position} />
      ))}
    </>
  );
}
