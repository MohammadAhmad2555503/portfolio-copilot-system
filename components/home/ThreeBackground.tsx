"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Orb({
  position,
  color,
  speed
}: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * (speed * 0.6);
  });

  return (
    <Float speed={speed + 0.6} rotationIntensity={0.35} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={0.32}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.18}
          speed={2}
          transparent
          opacity={0.58}
        />
      </mesh>
    </Float>
  );
}

export function ThreeBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 58 }} dpr={[1, 1.6]}>
        <ambientLight intensity={0.45} />
        <pointLight color="#00f0ff" intensity={3.2} position={[4, 4, 4]} />
        <pointLight color="#ff00e5" intensity={2.2} position={[-4, -3, 3]} />
        <Stars radius={80} depth={45} count={2200} factor={4} saturation={0.2} fade speed={0.6} />
        <Orb color="#00f0ff" position={[-3.4, 1.2, -1]} speed={0.22} />
        <Orb color="#7b2ff7" position={[2.9, -1.2, -0.8]} speed={0.18} />
        <Orb color="#ff00e5" position={[1.3, 2.2, -2.2]} speed={0.14} />
      </Canvas>
    </div>
  );
}

