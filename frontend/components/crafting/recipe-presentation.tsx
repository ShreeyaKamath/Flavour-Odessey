"use client";

import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DoubleSide, Group, MathUtils, type Texture } from "three";

import { CelebrationController } from "@/components/crafting/celebration-controller";
import { CraftingCamera } from "@/components/crafting/crafting-camera";
import { CraftingEffects } from "@/components/crafting/crafting-effects";
import { usePageVisibility } from "@/hooks/use-page-visibility";
import { useThreeAssetTexture } from "@/hooks/use-three-asset-texture";
import {
  craftingAssetSlots,
  craftingIngredientAssetSlots
} from "@/lib/crafting/crafting-asset-slots";
import {
  craftingMotion,
  craftingPalette,
  craftingTiming,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";
import { cn } from "@/utils/cn";

type RecipePresentationProps = {
  className?: string;
  interactive?: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
};

const sprinklePlacements = [
  [-0.34, 2.06, 0.2, 0.55, "#f49a9a"],
  [-0.18, 2.15, -0.16, -0.4, "#79d7b2"],
  [0.02, 2.22, 0.18, 0.25, "#ffd86b"],
  [0.22, 2.12, -0.18, -0.25, "#f49a9a"],
  [0.36, 1.98, 0.1, 0.5, "#79d7b2"],
  [-0.08, 1.98, 0.34, -0.2, "#ffd86b"],
  [0.16, 1.91, -0.3, 0.35, "#f49a9a"]
] as const;

function TexturedAssetPlane({
  position,
  rotation = [0, 0, 0],
  size,
  texture
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  texture: Texture;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} transparent />
    </mesh>
  );
}

function VanillaOrchidFallback() {
  return (
    <>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 10]} />
        <meshStandardMaterial color={craftingPalette.vanilla} roughness={0.72} />
      </mesh>
      {[0, 1, 2, 3, 4].map((petal) => {
        const angle = (petal / 5) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            position={[Math.cos(angle) * 0.22, 0.46 + Math.sin(angle) * 0.22, 0]}
            rotation={[0, 0, angle]}
          >
            <sphereGeometry args={[0.14, 12, 8]} />
            <meshStandardMaterial
              color={craftingPalette.orchid}
              emissive={craftingPalette.orchid}
              emissiveIntensity={0.35}
            />
          </mesh>
        );
      })}
    </>
  );
}

function HoneyBloomFallback() {
  return (
    <>
      <mesh castShadow>
        <sphereGeometry args={[0.34, 16, 12]} />
        <meshStandardMaterial
          color={craftingPalette.honey}
          emissive={craftingPalette.honey}
          emissiveIntensity={0.45}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <coneGeometry args={[0.18, 0.35, 8]} />
        <meshStandardMaterial color={craftingPalette.magic} />
      </mesh>
    </>
  );
}

function ProceduralSprinkles() {
  return (
    <>
      {sprinklePlacements.map(([x, y, z, rotation, color], index) => (
        <mesh
          castShadow
          key={`${x}-${z}-${index}`}
          position={[x, y, z]}
          rotation={[0, 0, rotation]}
        >
          <boxGeometry args={[0.16, 0.035, 0.035]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
    </>
  );
}

function ProceduralDrizzle() {
  return (
    <group position={[0, 2.02, 0]}>
      <mesh rotation={[1.22, 0.28, 0.12]}>
        <torusGeometry args={[0.43, 0.025, 8, 36, Math.PI * 1.35]} />
        <meshStandardMaterial color={craftingPalette.coneShadow} roughness={0.38} />
      </mesh>
      <mesh position={[-0.28, -0.22, 0.2]} rotation={[0.4, 0, 0.08]}>
        <capsuleGeometry args={[0.025, 0.42, 4, 8]} />
        <meshStandardMaterial color={craftingPalette.coneShadow} roughness={0.36} />
      </mesh>
    </group>
  );
}

function IngredientOrbit({
  paused,
  phase,
  reducedMotion
}: {
  paused: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
}) {
  const orbit = useRef<Group>(null);
  const { texture: honeyBloomTexture } = useThreeAssetTexture(
    craftingIngredientAssetSlots.honey_bloom
  );
  const { texture: vanillaOrchidTexture } = useThreeAssetTexture(
    craftingIngredientAssetSlots.vanilla_orchid
  );
  const active = ["charging", "materializing"].includes(phase);

  useFrame(({ clock }) => {
    if (!orbit.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    orbit.current.rotation.y = elapsed * craftingMotion.ingredientOrbitSpeed;
    orbit.current.position.y =
      1.1 +
      Math.sin(elapsed * craftingMotion.ingredientFloatSpeed) *
        craftingMotion.ingredientFloatAmount;
  });

  if (!active) {
    return null;
  }

  return (
    <group position={[0, 1.1, 0]} ref={orbit}>
      <group position={[craftingMotion.ingredientOrbitRadius, 0, 0]}>
        {vanillaOrchidTexture ? (
          <TexturedAssetPlane
            position={[0, 0.22, 0]}
            size={[0.92, 0.92]}
            texture={vanillaOrchidTexture}
          />
        ) : (
          <VanillaOrchidFallback />
        )}
      </group>
      <group position={[-craftingMotion.ingredientOrbitRadius, 0.15, 0]}>
        {honeyBloomTexture ? (
          <TexturedAssetPlane
            position={[0, 0.18, 0]}
            size={[0.86, 0.86]}
            texture={honeyBloomTexture}
          />
        ) : (
          <HoneyBloomFallback />
        )}
      </group>
    </group>
  );
}

function ProceduralGoldenVanillaBloom({
  drizzleTexture,
  scoopTexture,
  sprinklesTexture
}: {
  drizzleTexture: Texture | null;
  scoopTexture: Texture | null;
  sprinklesTexture: Texture | null;
}) {
  return (
    <>
      <mesh castShadow position={[0, 0.55, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.58, 1.5, 20]} />
        <meshStandardMaterial
          color={craftingPalette.cone}
          roughness={0.78}
          shadowSide={DoubleSide}
        />
      </mesh>
      <mesh castShadow position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.78, 30, 22]} />
        <meshStandardMaterial
          color={craftingPalette.scoop}
          emissive={craftingPalette.scoopGlow}
          emissiveIntensity={0.62}
          map={scoopTexture ?? undefined}
          metalness={0.04}
          roughness={0.48}
        />
      </mesh>
      {drizzleTexture ? (
        <TexturedAssetPlane
          position={[0, 2.04, 0.08]}
          rotation={[-0.52, 0, 0]}
          size={[1.18, 0.82]}
          texture={drizzleTexture}
        />
      ) : (
        <ProceduralDrizzle />
      )}
      {sprinklesTexture ? (
        <TexturedAssetPlane
          position={[0, 2.14, 0.1]}
          rotation={[-0.5, 0, 0]}
          size={[1.1, 0.74]}
          texture={sprinklesTexture}
        />
      ) : (
        <ProceduralSprinkles />
      )}
      <mesh castShadow position={[0, 2.12, 0]} rotation={[0, 0, -0.25]}>
        <sphereGeometry args={[0.2, 16, 10]} />
        <meshStandardMaterial
          color={craftingPalette.orchid}
          emissive={craftingPalette.orchid}
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
}

function GoldenVanillaBloom({
  interactive,
  paused,
  phase,
  reducedMotion
}: {
  interactive: boolean;
  paused: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
}) {
  const recipe = useRef<Group>(null);
  const { texture: drizzleTexture } = useThreeAssetTexture(craftingAssetSlots.drizzle);
  const { texture: recipeTexture } = useThreeAssetTexture(craftingAssetSlots.recipe);
  const { texture: scoopTexture } = useThreeAssetTexture(craftingAssetSlots.scoopBase);
  const { texture: sprinklesTexture } = useThreeAssetTexture(craftingAssetSlots.sprinkles);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const materializeStartedAt = useRef<number | null>(null);
  const targetRotation = useRef(0);
  const visible = ["materializing", "celebrating", "revealed", "returning", "complete"].includes(
    phase
  );

  useEffect(() => {
    const stopDragging = () => {
      dragging.current = false;
    };
    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!recipe.current || paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    if (!dragging.current) {
      targetRotation.current += delta * craftingMotion.autoRotateSpeed;
    }
    recipe.current.rotation.y = MathUtils.lerp(
      recipe.current.rotation.y,
      targetRotation.current,
      craftingMotion.modelRotationLerp
    );
    if (phase === "materializing" && materializeStartedAt.current === null) {
      materializeStartedAt.current = elapsed;
    } else if (phase !== "materializing") {
      materializeStartedAt.current = null;
    }
    const materializeElapsed =
      materializeStartedAt.current === null ? 0 : elapsed - materializeStartedAt.current;
    const materializeScale =
      phase === "materializing"
        ? MathUtils.clamp(materializeElapsed / (craftingTiming.materializeMs / 1000), 0.05, 1)
        : 1;
    const breathing =
      1 + Math.sin(elapsed * craftingMotion.breathingSpeed) * craftingMotion.breathingAmount;
    recipe.current.scale.setScalar(materializeScale * breathing);
    recipe.current.position.y = Math.sin(elapsed * craftingMotion.breathingSpeed) * 0.06;
  });

  if (!visible) {
    return null;
  }

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!interactive) {
      return;
    }
    event.stopPropagation();
    dragging.current = true;
    lastPointerX.current = event.clientX;
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!interactive || !dragging.current) {
      return;
    }
    event.stopPropagation();
    targetRotation.current +=
      (event.clientX - lastPointerX.current) * craftingMotion.modelDragSensitivity;
    lastPointerX.current = event.clientX;
  };

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      position={[0, 0.08, 0]}
      ref={recipe}
    >
      {recipeTexture ? (
        <TexturedAssetPlane position={[0, 1.24, 0]} size={[2.05, 2.55]} texture={recipeTexture} />
      ) : (
        <ProceduralGoldenVanillaBloom
          drizzleTexture={drizzleTexture}
          scoopTexture={scoopTexture}
          sprinklesTexture={sprinklesTexture}
        />
      )}
      <pointLight
        color={craftingPalette.goldenLight}
        distance={5}
        intensity={2.4}
        position={[0, 1.5, 0.6]}
      />
    </group>
  );
}

/** Renders the interactive, reusable 3D stage for a completed magical recipe. */
export function RecipePresentation({
  className,
  interactive = false,
  phase,
  reducedMotion
}: RecipePresentationProps) {
  const visible = usePageVisibility();

  return (
    <div
      aria-label="Golden Vanilla Bloom three-dimensional presentation"
      className={cn(
        "min-h-[24rem] overflow-hidden bg-foreground",
        interactive && "cursor-grab active:cursor-grabbing",
        className
      )}
      data-crafting-phase={phase}
      data-particles-paused={String(!visible)}
      data-render-source="asset_manifest"
      data-visual-element="golden_vanilla_bloom"
      role="img"
      title={interactive ? "Drag to turn the recipe and scroll to zoom" : undefined}
    >
      <Canvas
        camera={{ far: 30, fov: 42, near: 0.1, position: [0, 2.5, 7.4] }}
        className="h-full w-full"
        dpr={[1, 1.5]}
        frameloop={visible && !reducedMotion ? "always" : "demand"}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
        performance={{ min: 0.6 }}
        shadows
      >
        <color args={[craftingPalette.backdrop]} attach="background" />
        <fog args={[craftingPalette.fog, 5.5, 13]} attach="fog" />
        <ambientLight color={craftingPalette.vanilla} intensity={0.75} />
        <directionalLight
          castShadow
          color={craftingPalette.goldenLight}
          intensity={2.4}
          position={[3, 6, 4]}
          shadow-mapSize-height={512}
          shadow-mapSize-width={512}
        />
        <mesh receiveShadow position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.2, 48]} />
          <meshStandardMaterial color={craftingPalette.shadow} roughness={0.92} />
        </mesh>
        <CraftingCamera
          interactive={interactive}
          paused={!visible}
          phase={phase}
          reducedMotion={reducedMotion}
        />
        <CraftingEffects paused={!visible} phase={phase} reducedMotion={reducedMotion} />
        <IngredientOrbit paused={!visible} phase={phase} reducedMotion={reducedMotion} />
        <GoldenVanillaBloom
          interactive={interactive}
          paused={!visible}
          phase={phase}
          reducedMotion={reducedMotion}
        />
        <CelebrationController paused={!visible} phase={phase} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
