import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import Points from "./Points";
import type { VisualizationPoint } from "@/lib/api/visualization";
import { RAYCASTER_THRESHOLD } from "./constants";

interface SceneProps {
  points: VisualizationPoint[];
  onSelectPoint: (point: VisualizationPoint | null) => void;
  selectedPointId: number | null;
  cameraRef: React.RefObject<OrbitControlsType | null>;
  spreadFactor: number;
  highlightedPointIds: Set<number> | null;
  vizType?: "default" | "umap" | "sphere";
}

const Scene: React.FC<SceneProps> = ({
  points,
  onSelectPoint,
  selectedPointId,
  cameraRef,
  spreadFactor,
  highlightedPointIds,
  vizType,
}) => {
  // Calculate center of points for camera target
  const center = useMemo(() => {
    if (points.length === 0) return new THREE.Vector3(0, 0, 0);

    const sum = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y, z: acc.z + p.z }),
      { x: 0, y: 0, z: 0 }
    );

    return new THREE.Vector3(
      sum.x / points.length,
      sum.y / points.length,
      sum.z / points.length
    );
  }, [points]);

  // Adjust camera zoom based on visualization type
  const cameraPosition = useMemo(() => {
    switch (vizType) {
      case "umap":
        return [0, 0, 5] as const; // Closer zoom for UMAP
      case "sphere":
        return [0, 0, 10] as const; // Slightly zoomed out for Sphere
      default:
        return [0, 0, 15] as const; // Default zoom for t-SNE
    }
  }, [vizType]);

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 60 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      raycaster={{
        params: {
          Points: { threshold: RAYCASTER_THRESHOLD },
          Line: { threshold: 1 },
          LOD: {},
          Mesh: {},
          Sprite: {},
        },
      }}
    >
      <ambientLight intensity={0.8} />

      <Points
        points={points}
        onSelectPoint={onSelectPoint}
        selectedPointId={selectedPointId}
        spreadFactor={spreadFactor}
        highlightedPointIds={highlightedPointIds}
        vizType={vizType}
      />

      <OrbitControls
        ref={cameraRef}
        target={center}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
      />
    </Canvas>
  );
};

export default Scene;
