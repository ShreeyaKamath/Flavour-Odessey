"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { Color } from "three";

import { WebGLFallback } from "@/components/production/webgl-fallback";
import { detectWebGLAvailable } from "@/lib/production/browser-capabilities";

function FoundationMesh() {
  const materialColor = useMemo(() => new Color("#76cdbc"), []);

  return (
    <mesh rotation={[0.35, 0.55, 0]}>
      <torusKnotGeometry args={[1.05, 0.28, 96, 12]} />
      <meshStandardMaterial color={materialColor} roughness={0.42} />
    </mesh>
  );
}

/** Renders the lightweight Three.js foundation scene. */
export function FoundationScene() {
  const canRenderWebGL = typeof window === "undefined" || detectWebGLAvailable();

  if (!canRenderWebGL) {
    return <WebGLFallback label="The storybook scene is shown in fallback mode." />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      className="h-full min-h-64 w-full"
      dpr={[1, 1.5]}
      fallback={<WebGLFallback label="The storybook scene is shown in fallback mode." />}
    >
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.4} position={[3, 4, 5]} />
      <FoundationMesh />
    </Canvas>
  );
}
