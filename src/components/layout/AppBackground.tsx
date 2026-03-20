import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getThemeThreeColor } from "@/lib/theme-utils";

const ParticleSystem = ({ theme }: { theme: string }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate glowing void particles
  const particlesCount = 2000;
  const positions = useMemo(() => new Float32Array(particlesCount * 3), []);

  // We compute colors on render so they potentially catch the theme
  const colors = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3);
    const cyan = getThemeThreeColor("--accent-cyan", "#22D3EE");
    const amber = getThemeThreeColor("--accent-amber", "#FBBF24");

    for (let i = 0; i < particlesCount; i++) {
      // Spherical distribution
      const r = 20 + Math.random() * 50;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const isCyan = Math.random() > 0.5;
      const color = (isCyan ? cyan.clone() : amber.clone()).multiplyScalar(
        0.3 + Math.random() * 0.4,
      );

      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [positions, theme]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors={true}
        transparent={true}
        opacity={0.6}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
};

const AppBackground: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setCurrentTheme(e.detail);
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const fogColor = useMemo(
    () => getThemeThreeColor("--bg-color", "#000000"),
    [currentTheme],
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        {/* Fog color follows the theme's background color */}
        <fog attach="fog" args={[fogColor.getHex(), 10, 80]} />
        <ParticleSystem theme={currentTheme} />
      </Canvas>
    </div>
  );
};

export default AppBackground;
