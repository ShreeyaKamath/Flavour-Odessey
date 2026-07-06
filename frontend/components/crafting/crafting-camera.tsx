"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Vector3 } from "three";

import {
  craftingCameraFrames,
  craftingMotion,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";

type CraftingCameraProps = {
  interactive: boolean;
  paused: boolean;
  phase: CraftingPhase;
  reducedMotion: boolean;
};

/** Directs cinematic crafting focus, orbit, zoom, and return framing. */
export function CraftingCamera({ interactive, paused, phase, reducedMotion }: CraftingCameraProps) {
  const { camera, gl } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const zoomOffset = useRef(0);

  useEffect(() => {
    if (!interactive) {
      zoomOffset.current = 0;
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomOffset.current = MathUtils.clamp(
        zoomOffset.current + event.deltaY * craftingMotion.zoomSensitivity,
        craftingMotion.zoomMin - craftingCameraFrames[phase].position[2],
        craftingMotion.zoomMax - craftingCameraFrames[phase].position[2]
      );
    };
    const canvas = gl.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [gl, interactive, phase]);

  useEffect(() => {
    if (!reducedMotion) {
      return;
    }
    const frame = craftingCameraFrames[phase];
    camera.position.set(...frame.position);
    camera.lookAt(...frame.target);
  }, [camera, phase, reducedMotion]);

  useFrame(({ clock }) => {
    if (paused || reducedMotion) {
      return;
    }

    const frame = craftingCameraFrames[phase];
    const orbit =
      phase === "celebrating"
        ? Math.sin(clock.getElapsedTime() * craftingMotion.cameraOrbitSpeed) *
          craftingMotion.cameraOrbitRadius
        : 0;
    camera.position.x = MathUtils.lerp(
      camera.position.x,
      frame.position[0] + orbit,
      craftingMotion.cameraLerp
    );
    camera.position.y = MathUtils.lerp(
      camera.position.y,
      frame.position[1],
      craftingMotion.cameraLerp
    );
    camera.position.z = MathUtils.lerp(
      camera.position.z,
      frame.position[2] + zoomOffset.current,
      craftingMotion.cameraLerp
    );
    target.set(...frame.target);
    camera.lookAt(target);
  });

  return null;
}
