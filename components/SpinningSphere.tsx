"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { viewport, mouse } = useThree();

  // Animated rotation and position
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.5;

      // Mouse-responsive movement with smooth interpolation
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * delta * 3;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * delta * 3;
    }
  });

  // Custom shader material for glow effect
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHovered: { value: 0 },
        uColor1: { value: new THREE.Color("#00ffff") },
        uColor2: { value: new THREE.Color("#ff00ff") },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHovered;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          // Fresnel glow effect
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Animated color
          vec3 color = mix(uColor1, uColor2, sin(uTime * 2.0) * 0.5 + 0.5);
          
          // Add glow intensity on hover
          float glowIntensity = fresnel * (1.5 + uHovered * 0.5);
          
          // Inner glow
          vec3 innerGlow = color * 0.6;
          
          // Combine effects
          vec3 finalColor = mix(color, innerGlow, 1.0 - fresnel);
          finalColor += color * glowIntensity;
          
          gl_FragColor = vec4(finalColor, 0.9 + fresnel * 0.1);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Update shader uniforms
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uHovered.value = hovered ? 1 : 0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <sphereGeometry args={[1.5, 64, 64]} />
      <primitive object={glowMaterial} attach="material" />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    setPositions(pos);
  }, [count]);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1;
      particlesRef.current.rotation.x += delta * 0.05;
    }
  });

  if (!positions) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function SpinningSphere() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        <GlowingSphere />
        <Particles />
      </Canvas>
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          textAlign: "center",
          opacity: 0.7,
          pointerEvents: "none",
        }}
      >
        Move your mouse around • Hover to enlarge
      </div>
    </div>
  );
}
