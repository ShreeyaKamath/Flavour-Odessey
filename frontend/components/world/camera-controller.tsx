"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Vector3 } from "three";

import { environmentMotion } from "@/lib/world/joy-meadow-config";

type CameraControllerProps = {
  paused: boolean;
  reducedMotion: boolean;
};

/** Adds bounded float, pointer parallax, and wheel zoom to the scene camera. */
export function CameraController({ paused, reducedMotion }: CameraControllerProps) {
  const { camera, gl, pointer } = useThree();
  const target = useMemo(() => new Vector3(0, 1.2, -1.5), []);
  const zoom = useRef(10.5);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      zoom.current = MathUtils.clamp(
        zoom.current + event.deltaY * environmentMotion.zoomSensitivity,
        environmentMotion.zoomMin,
        environmentMotion.zoomMax
      );
    };
    const canvas = gl.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: true });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [gl]);

  useFrame(({ clock }) => {
    if (paused || reducedMotion) {
      return;
    }
    const elapsed = clock.getElapsedTime();
    const targetX = pointer.x * environmentMotion.parallaxStrength;
    const targetY =
      4.5 +
      pointer.y * environmentMotion.parallaxStrength * 0.45 +
      Math.sin(elapsed * environmentMotion.cameraFloatSpeed) *
        environmentMotion.cameraFloatAmplitude;
    camera.position.x = MathUtils.lerp(camera.position.x, targetX, environmentMotion.cameraLerp);
    camera.position.y = MathUtils.lerp(camera.position.y, targetY, environmentMotion.cameraLerp);
    camera.position.z = MathUtils.lerp(
      camera.position.z,
      zoom.current,
      environmentMotion.cameraLerp
    );
    camera.lookAt(target);
  });

  return null;
}
