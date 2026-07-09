"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

import { useAssetTexture } from "@/components/world/use-asset-texture";
import {
  environmentMotion,
  joyMeadowLandmarks,
  joyMeadowPalette
} from "@/lib/world/joy-meadow-config";

type JoyMeadowLandmarksProps = {
  paused: boolean;
  reducedMotion: boolean;
  restored: boolean;
};

type LandmarkId = (typeof joyMeadowLandmarks)[number]["id"];

function landmarkPosition(id: LandmarkId): [number, number, number] {
  const landmark = joyMeadowLandmarks.find((entry) => entry.id === id);
  return landmark ? [...landmark.position] : [0, 0, 0];
}

function Windmill({ paused, reducedMotion }: Omit<JoyMeadowLandmarksProps, "restored">) {
  const blades = useRef<Group>(null);
  const { texture: windmillTexture } = useAssetTexture("environment.windmill");

  useFrame((_, delta) => {
    if (!blades.current || paused || reducedMotion) {
      return;
    }
    blades.current.rotation.z -= delta * environmentMotion.windmillSpeed;
  });

  return (
    <group position={landmarkPosition("windmill")}>
      <mesh castShadow position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.48, 0.7, 2.1, 10]} />
        <meshStandardMaterial
          color={joyMeadowPalette.windmill}
          map={windmillTexture ?? undefined}
          roughness={0.88}
        />
      </mesh>
      <mesh castShadow position={[0, 2.25, 0]}>
        <coneGeometry args={[0.76, 0.72, 10]} />
        <meshStandardMaterial
          color={joyMeadowPalette.cottageRoof}
          map={windmillTexture ?? undefined}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 1.05, 0.62]} ref={blades}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color={joyMeadowPalette.bridge} roughness={0.75} />
        {[0, 1, 2, 3].map((index) => {
          const rotation = (index * Math.PI) / 2;
          return (
            <mesh
              castShadow
              key={index}
              position={[Math.sin(rotation) * 0.58, Math.cos(rotation) * 0.58, 0]}
              rotation={[0, 0, -rotation]}
            >
              <boxGeometry args={[0.14, 1.08, 0.07]} />
              <meshStandardMaterial color={joyMeadowPalette.flowerWhite} roughness={0.7} />
            </mesh>
          );
        })}
      </mesh>
    </group>
  );
}

function SmallBridge() {
  const { texture: bridgeTexture } = useAssetTexture("environment.bridge");

  return (
    <group position={landmarkPosition("small_bridge")}>
      {[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((x) => (
        <mesh castShadow key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.26, 0.12, 1.85]} />
          <meshStandardMaterial
            color={joyMeadowPalette.bridge}
            map={bridgeTexture ?? undefined}
            roughness={0.92}
          />
        </mesh>
      ))}
      {[-1.08, 1.08].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 0.38, -0.78]}>
            <cylinderGeometry args={[0.06, 0.07, 0.76, 7]} />
            <meshStandardMaterial color={joyMeadowPalette.bark} />
          </mesh>
          <mesh castShadow position={[x, 0.38, 0.78]}>
            <cylinderGeometry args={[0.06, 0.07, 0.76, 7]} />
            <meshStandardMaterial color={joyMeadowPalette.bark} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function IceCreamTree() {
  const { texture: treeTexture } = useAssetTexture("environment.tree");

  return (
    <group position={landmarkPosition("ice_cream_tree")}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.23, 0.38, 2, 8]} />
        <meshStandardMaterial
          color={joyMeadowPalette.bark}
          map={treeTexture ?? undefined}
          roughness={0.95}
        />
      </mesh>
      <mesh castShadow position={[-0.45, 2.05, 0]} scale={1.1}>
        <sphereGeometry args={[0.68, 18, 14]} />
        <meshStandardMaterial color={joyMeadowPalette.iceCreamPink} roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0.42, 2.18, 0.04]}>
        <sphereGeometry args={[0.72, 18, 14]} />
        <meshStandardMaterial color={joyMeadowPalette.iceCreamMint} roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 2.65, -0.05]} scale={0.86}>
        <sphereGeometry args={[0.7, 18, 14]} />
        <meshStandardMaterial color={joyMeadowPalette.iceCreamVanilla} roughness={0.72} />
      </mesh>
    </group>
  );
}

function MeadowKeeperHouse() {
  const { texture: houseTexture } = useAssetTexture("environment.npc_house");

  return (
    <group position={landmarkPosition("meadow_keeper_house")}>
      <mesh castShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[1.75, 1.45, 1.5]} />
        <meshStandardMaterial
          color={joyMeadowPalette.cottage}
          map={houseTexture ?? undefined}
          roughness={0.9}
        />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.45, 1.05, 4]} />
        <meshStandardMaterial
          color={joyMeadowPalette.cottageRoof}
          map={houseTexture ?? undefined}
          roughness={0.85}
        />
      </mesh>
      <mesh position={[0, 0.55, 0.77]}>
        <boxGeometry args={[0.46, 0.86, 0.05]} />
        <meshStandardMaterial color={joyMeadowPalette.bark} roughness={0.9} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.92, 0.78]}>
          <boxGeometry args={[0.34, 0.34, 0.06]} />
          <meshStandardMaterial
            color={joyMeadowPalette.riverHighlight}
            emissive={joyMeadowPalette.riverHighlight}
            emissiveIntensity={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

function RecipeShrine({ restored }: { restored: boolean }) {
  const { texture: shrineTexture } = useAssetTexture("environment.recipe_shrine");

  return (
    <group position={landmarkPosition("recipe_shrine")}>
      <mesh receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.95, 1.1, 0.24, 10]} />
        <meshStandardMaterial
          color={joyMeadowPalette.shrine}
          map={shrineTexture ?? undefined}
          roughness={0.78}
        />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <mesh castShadow key={x} position={[x, 0.78, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 1.35, 8]} />
          <meshStandardMaterial color={joyMeadowPalette.shrine} roughness={0.8} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.43, 0]}>
        <boxGeometry args={[1.45, 0.18, 0.55]} />
        <meshStandardMaterial color={joyMeadowPalette.shrine} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={joyMeadowPalette.recipeGlow}
          emissive={joyMeadowPalette.recipeGlow}
          emissiveIntensity={restored ? 1.8 : 0.5}
        />
      </mesh>
      <pointLight
        color={joyMeadowPalette.recipeGlow}
        distance={4}
        intensity={restored ? 1.4 : 0.4}
        position={[0, 0.9, 0]}
      />
    </group>
  );
}

function JournalTree({ paused, reducedMotion }: Omit<JoyMeadowLandmarksProps, "restored">) {
  const canopy = useRef<Group>(null);
  const { texture: journalTreeTexture } = useAssetTexture("environment.journal_tree");

  useFrame(({ clock }) => {
    if (!canopy.current || paused || reducedMotion) {
      return;
    }
    canopy.current.rotation.z =
      Math.sin(clock.getElapsedTime() * environmentMotion.journalTreeSwaySpeed) * 0.015;
  });

  return (
    <group position={landmarkPosition("journal_tree")}>
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.28, 0.5, 2.5, 9]} />
        <meshStandardMaterial
          color={joyMeadowPalette.bark}
          map={journalTreeTexture ?? undefined}
          roughness={0.98}
        />
      </mesh>
      <group position={[0, 2.35, 0]} ref={canopy}>
        <mesh castShadow>
          <dodecahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color={joyMeadowPalette.leaf}
            map={journalTreeTexture ?? undefined}
            roughness={0.88}
          />
        </mesh>
        <mesh position={[0.7, -0.05, 0.1]} scale={0.72}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color={joyMeadowPalette.leafLight} roughness={0.88} />
        </mesh>
      </group>
      <group position={[0, 1.15, 0.52]} rotation={[-0.12, 0, 0]}>
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.34, 0.42, 0.05]} />
          <meshStandardMaterial color={joyMeadowPalette.flowerWhite} roughness={0.75} />
        </mesh>
        <mesh position={[0.18, 0, 0]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.34, 0.42, 0.05]} />
          <meshStandardMaterial color={joyMeadowPalette.flowerWhite} roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
}

/** Renders every named Joy Meadow environmental landmark. */
export function JoyMeadowLandmarks(props: JoyMeadowLandmarksProps) {
  return (
    <>
      <Windmill paused={props.paused} reducedMotion={props.reducedMotion} />
      <SmallBridge />
      <IceCreamTree />
      <MeadowKeeperHouse />
      <RecipeShrine restored={props.restored} />
      <JournalTree paused={props.paused} reducedMotion={props.reducedMotion} />
    </>
  );
}
