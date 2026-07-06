"use client";

import { type ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import { Group, MathUtils } from "three";

import { environmentMotion } from "@/lib/world/joy-meadow-config";

type ParallaxManagerProps = ThreeElements["group"] & {
  children: ReactNode;
  paused: boolean;
  reducedMotion: boolean;
};

/** Moves distant environment layers independently from the foreground. */
export function ParallaxManager({
  children,
  paused,
  reducedMotion,
  ...props
}: ParallaxManagerProps) {
  const group = useRef<Group>(null);
  const pointer = useThree((state) => state.pointer);

  useFrame(() => {
    if (!group.current || paused || reducedMotion) {
      return;
    }
    group.current.position.x = MathUtils.lerp(
      group.current.position.x,
      pointer.x * environmentMotion.parallaxStrength,
      environmentMotion.parallaxLerp
    );
    group.current.position.y = MathUtils.lerp(
      group.current.position.y,
      pointer.y * environmentMotion.parallaxStrength * 0.2,
      environmentMotion.parallaxLerp
    );
  });

  return (
    <group ref={group} {...props}>
      {children}
    </group>
  );
}
