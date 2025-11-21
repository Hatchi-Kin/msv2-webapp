import React, { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import type { VisualizationPoint } from "@/lib/api/visualization";
import { POINT_SIZES, POINT_ALPHAS, POINT_COLORS } from "./constants";

interface PointsProps {
  points: VisualizationPoint[];
  onSelectPoint: (point: VisualizationPoint | null) => void;
  selectedPointId: number | null;
  spreadFactor: number;
  highlightedPointIds: Set<number> | null;
}

// Pre-create color objects for performance
const SELECTED_COLOR = new THREE.Color(POINT_COLORS.SELECTED);
const HOVER_COLOR = new THREE.Color(POINT_COLORS.HOVER);

// Create material once and reuse
const createDotMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: {
      scale: { value: 1.0 },
    },
    vertexShader: `
    attribute float size;
    attribute float alpha;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vAlpha = alpha;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      if (dist > 0.5) discard;
      
      if (dist > 0.45) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, vAlpha);
      } else {
        gl_FragColor = vec4(vColor, vAlpha);
      }
    }
  `,
    vertexColors: true,
    transparent: true,
    depthWrite: true,
    depthTest: true,
  });

// Create material once outside component to avoid recreation
const dotMaterial = createDotMaterial();

const Points: React.FC<PointsProps> = ({
  points,
  onSelectPoint,
  selectedPointId,
  spreadFactor,
  highlightedPointIds,
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Create geometry attributes - memoized to avoid recreation on every render
  const { positions, colors, sizes, alphas, originalColors } = useMemo(() => {
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    const originalColors = new Float32Array(points.length * 3);
    const sizes = new Float32Array(points.length);
    const alphas = new Float32Array(points.length);

    const colorObj = new THREE.Color();

    points.forEach((point, i) => {
      const i3 = i * 3;
      positions[i3] = point.x * spreadFactor;
      positions[i3 + 1] = point.y * spreadFactor;
      positions[i3 + 2] = point.z * spreadFactor;

      colorObj.set(point.cluster_color);
      colors[i3] = originalColors[i3] = colorObj.r;
      colors[i3 + 1] = originalColors[i3 + 1] = colorObj.g;
      colors[i3 + 2] = originalColors[i3 + 2] = colorObj.b;

      sizes[i] = POINT_SIZES.BASE;
      alphas[i] = POINT_ALPHAS.BASE;
    });

    return { positions, colors, sizes, alphas, originalColors };
  }, [points, spreadFactor]);

  // Update visual attributes based on selection and hover
  useEffect(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    const sizeAttr = geometry.getAttribute("size") as THREE.BufferAttribute;
    const alphaAttr = geometry.getAttribute("alpha") as THREE.BufferAttribute;
    const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute;

    // Update all points
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const isSelected = point.id === selectedPointId;
      const isHovered = i === hoveredIndex;
      const i3 = i * 3;

      // Determine if point should be dimmed
      // If highlighting is active (Set is not null), dim points NOT in the set
      const isDimmed = highlightedPointIds
        ? !highlightedPointIds.has(point.id)
        : false;

      if (isSelected) {
        sizeAttr.setX(i, POINT_SIZES.SELECTED);
        alphaAttr.setX(i, POINT_ALPHAS.SELECTED);
        colorAttr.setXYZ(
          i,
          SELECTED_COLOR.r,
          SELECTED_COLOR.g,
          SELECTED_COLOR.b
        );
      } else if (isHovered) {
        sizeAttr.setX(i, POINT_SIZES.HOVER);
        alphaAttr.setX(i, POINT_ALPHAS.HOVER);
        colorAttr.setXYZ(i, HOVER_COLOR.r, HOVER_COLOR.g, HOVER_COLOR.b);
      } else {
        sizeAttr.setX(i, POINT_SIZES.BASE);
        // Apply dimming if needed
        alphaAttr.setX(i, isDimmed ? 0.1 : POINT_ALPHAS.BASE);
        colorAttr.setXYZ(
          i,
          originalColors[i3],
          originalColors[i3 + 1],
          originalColors[i3 + 2]
        );
      }
    }

    sizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  }, [
    points,
    selectedPointId,
    hoveredIndex,
    originalColors,
    highlightedPointIds,
  ]);

  const handlePointerMove = (e: { intersections: THREE.Intersection[] }) => {
    // Get the closest intersection by distance
    let closestIndex: number | null = null;

    if (e.intersections && e.intersections.length > 0) {
      const sortedIntersections = [...e.intersections].sort(
        (a, b) => a.distance - b.distance
      );
      closestIndex = sortedIntersections[0].index ?? null;
    }

    if (closestIndex !== null) {
      document.body.style.cursor = "pointer";
      setHoveredIndex(closestIndex);
    } else {
      document.body.style.cursor = "auto";
      setHoveredIndex(null);
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
    setHoveredIndex(null);
  };

  const handleClick = (e: { intersections: THREE.Intersection[] }) => {
    // Get all intersections and find the closest one by distance
    if (e.intersections && e.intersections.length > 0) {
      // Sort by distance to camera (closest first)
      const sortedIntersections = [...e.intersections].sort(
        (a, b) => a.distance - b.distance
      );
      const closest = sortedIntersections[0];

      if (closest.index !== undefined) {
        const point = points[closest.index];
        onSelectPoint(point);
        return;
      }
    }

    onSelectPoint(null);
  };

  return (
    <points
      ref={meshRef}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      material={dotMaterial}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-alpha" args={[alphas, 1]} />
      </bufferGeometry>
    </points>
  );
};

export default Points;
