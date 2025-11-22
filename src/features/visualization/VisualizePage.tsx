import React, { useEffect, useState, useRef, useMemo } from "react";
import type { OrbitControls } from "three-stdlib";
import { useAuth } from "@/context/AuthContext";
import { visualizationApi } from "@/lib/api/visualization";
import type {
  VisualizationPoint,
  VisualizationStats,
} from "@/lib/api/visualization";
import Scene from "./Scene";
import TrackCard from "./TrackCard";
import Controls from "./Controls";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BATCH_SIZE,
  MAX_POINTS,
  DEFAULT_POINT_LIMIT,
  DEFAULT_SPREAD_FACTOR,
} from "./constants";

const VisualizationPage: React.FC = () => {
  const { accessToken } = useAuth();
  const [points, setPoints] = useState<VisualizationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<VisualizationPoint | null>(
    null
  );

  const cameraRef = useRef<OrbitControls>(null);

  const [pointLimit, setPointLimit] = useState(DEFAULT_POINT_LIMIT);
  const [debouncedPointLimit, setDebouncedPointLimit] = useState(DEFAULT_POINT_LIMIT);
  const [maxAvailablePoints, setMaxAvailablePoints] = useState(0);
  const [spreadFactor, setSpreadFactor] = useState(DEFAULT_SPREAD_FACTOR);
  const [vizType, setVizType] = useState<"default" | "umap" | "sphere">("umap");

  const [stats, setStats] = useState<VisualizationStats | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Debounce pointLimit changes (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPointLimit(pointLimit);
    }, 300);

    return () => clearTimeout(timer);
  }, [pointLimit]);

  // Fetch points on mount - with batched loading for large datasets
  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const targetLimit = Math.min(debouncedPointLimit, MAX_POINTS);

        // Fetch initial points and stats in parallel
        const [firstBatch, statsResponse] = await Promise.all([
          visualizationApi.getPoints(
            accessToken,
            Math.min(BATCH_SIZE, targetLimit),
            0,
            vizType === "default" ? undefined : vizType
          ),
          visualizationApi.getStats(
            accessToken,
            vizType === "default" ? undefined : vizType
          ),
        ]);

        if (statsResponse) {
          // Normalize genres (merge Hip Hop and Hip-Hop)
          const normalizedStats = { ...statsResponse };
          const genreMap = new Map<
            string,
            { genre: string; count: number; percentage: number }
          >();

          normalizedStats.top_genres.forEach((g) => {
            if (!g.genre) return; // Skip invalid genres
            // Normalize key: lowercase, remove hyphens and spaces
            const key = g.genre.toLowerCase().replace(/[-\s]/g, "");

            if (genreMap.has(key)) {
              const existing = genreMap.get(key)!;
              existing.count += g.count;
              // Keep the one with more counts or the first one as display name
              // Or prefer "Hip Hop" over "Hip-Hop" if you want specific preference
            } else {
              genreMap.set(key, { ...g });
            }
          });

          // Convert back to array and sort
          normalizedStats.top_genres = Array.from(genreMap.values()).sort(
            (a, b) => b.count - a.count
          );

          setStats(normalizedStats);
        }

        let allPoints = [...firstBatch.points];
        setMaxAvailablePoints(firstBatch.total);

        // Fetch additional batches if needed
        if (targetLimit > BATCH_SIZE && firstBatch.total > BATCH_SIZE) {
          const remainingToFetch = Math.min(
            targetLimit - BATCH_SIZE,
            firstBatch.total - BATCH_SIZE
          );
          const batches = Math.ceil(remainingToFetch / BATCH_SIZE);

          for (let i = 0; i < batches; i++) {
            const offset = BATCH_SIZE * (i + 1);
            const limit = Math.min(BATCH_SIZE, targetLimit - offset);

            const batch = await visualizationApi.getPoints(
              accessToken,
              limit,
              offset,
              vizType === "default" ? undefined : vizType
            );
            allPoints = [...allPoints, ...batch.points];

            // Update UI progressively
            setPoints([...allPoints]);
          }
        }

        setPoints(allPoints);
        console.log(`Loaded ${allPoints.length} of ${firstBatch.total} points`);
      } catch (error) {
        console.error("Failed to fetch visualization points:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load visualization data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, debouncedPointLimit, vizType]);

  // Handle point selection
  const handleSelectPoint = (point: VisualizationPoint | null) => {
    setSelectedPoint(point);
  };

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.reset();
    }
    setSelectedPoint(null);
    setSelectedGenre(null);
  };

  // Calculate highlighted points based on filter
  const highlightedPointIds = useMemo(() => {
    const ids = new Set<number>();

    // If genre is selected, add matching points
    if (selectedGenre) {
      const selectedKey = selectedGenre.toLowerCase().replace(/[-\s]/g, "");

      points.forEach((p) => {
        if (!p.genre) return;
        const pointGenreKey = p.genre.toLowerCase().replace(/[-\s]/g, "");

        if (pointGenreKey === selectedKey) {
          ids.add(p.id);
        }
      });
    }

    // If no filters active, return empty set (meaning show all)
    if (!selectedGenre) {
      return null;
    }

    return ids;
  }, [selectedGenre, points]);

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-background/50 backdrop-blur-sm rounded-3xl border border-border mt-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-background/50 backdrop-blur-sm gap-4 text-center rounded-3xl border border-border mt-6">
        <div className="text-destructive font-bold text-xl">
          Error Loading Visualization
        </div>
        <div className="text-muted-foreground">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-3xl border border-border shadow-2xl glass-panel backdrop-blur-xl mt-6">
      <Scene
        points={points}
        onSelectPoint={handleSelectPoint}
        selectedPointId={selectedPoint?.id || null}
        cameraRef={cameraRef}
        spreadFactor={spreadFactor}
        highlightedPointIds={highlightedPointIds}
        vizType={vizType}
      />

      <Controls
        onResetCamera={handleResetCamera}
        totalPoints={points.length}
        pointLimit={pointLimit}
        setPointLimit={setPointLimit}
        maxAvailablePoints={maxAvailablePoints}
        spreadFactor={spreadFactor}
        setSpreadFactor={setSpreadFactor}
        vizType={vizType}
        setVizType={setVizType}
        stats={stats}
        selectedGenre={selectedGenre}
        onSelectGenre={handleGenreSelect}
      />

      {selectedPoint && (
        <TrackCard
          point={selectedPoint}
          onClose={() => handleSelectPoint(null)}
        />
      )}
    </div>
  );
};

export default VisualizationPage;
