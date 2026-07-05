"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { Color } from "three";

function FoundationMesh() {
  const materialColor = useMemo(() => new Color("#76cdbc"), []);

  return (
    <mesh rotation={[0.35, 0.55, 0]}>
      <torusKnotGeometry args={[1.05, 0.28, 96, 12]} />
      <meshStandardMaterial color={materialColor} roughness={0.42} />
    </mesh>
  );
}

export function FoundationScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      className="h-full min-h-64 w-full"
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.4} position={[3, 4, 5]} />
      <FoundationMesh />
    </Canvas>
  );
}
