"use client";

import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils } from "three";

import { CelebrationController } from "@/components/crafting/celebration-controller";
import { CraftingCamera } from "@/components/crafting/crafting-camera";
import { CraftingEffects } from "@/components/crafting/crafting-effects";
import { usePageVisibility } from "@/hooks/use-page-visibility";
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
      </group>
      <group position={[-craftingMotion.ingredientOrbitRadius, 0.15, 0]}>
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
      </group>
    </group>
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
      <mesh castShadow position={[0, 0.55, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.58, 1.5, 20]} />
        <meshStandardMaterial color={craftingPalette.cone} roughness={0.78} shadowSide={2} />
      </mesh>
      <mesh castShadow position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.78, 30, 22]} />
        <meshStandardMaterial
          color={craftingPalette.scoop}
          emissive={craftingPalette.scoopGlow}
          emissiveIntensity={0.62}
          metalness={0.04}
          roughness={0.48}
        />
      </mesh>
      <mesh castShadow position={[0, 2.12, 0]} rotation={[0, 0, -0.25]}>
        <sphereGeometry args={[0.2, 16, 10]} />
        <meshStandardMaterial
          color={craftingPalette.orchid}
          emissive={craftingPalette.orchid}
          emissiveIntensity={0.5}
        />
      </mesh>
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
