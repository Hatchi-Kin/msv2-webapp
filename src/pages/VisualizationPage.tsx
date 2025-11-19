import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { OrbitControls } from 'three-stdlib';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { visualizationApi } from '@/lib/api/visualization';
import type { VisualizationPoint } from '@/lib/api/visualization';
import Scene from '@/components/visualization/Scene';
import TrackCard from '@/components/visualization/TrackCard';
import Controls from '@/components/visualization/Controls';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BATCH_SIZE, MAX_POINTS, DEFAULT_POINT_LIMIT, DEFAULT_SPREAD_FACTOR } from '@/components/visualization/constants';

const VisualizationPage: React.FC = () => {
  const { accessToken } = useAuth();
  const [points, setPoints] = useState<VisualizationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<VisualizationPoint | null>(null);
  
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  
  const cameraRef = useRef<OrbitControls>(null);

  const [pointLimit, setPointLimit] = useState(DEFAULT_POINT_LIMIT);
  const [maxAvailablePoints, setMaxAvailablePoints] = useState(0);
  const [spreadFactor, setSpreadFactor] = useState(DEFAULT_SPREAD_FACTOR);

  // Fetch points and favorites on mount - with batched loading for large datasets
  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const targetLimit = Math.min(pointLimit, MAX_POINTS);
        
        // Fetch favorites and initial points in parallel
        const [favResponse, firstBatch] = await Promise.all([
          api.music.getFavorites(accessToken).catch(err => {
            console.error('Failed to fetch favorites:', err);
            return { tracks: [] };
          }),
          visualizationApi.getPoints(accessToken, Math.min(BATCH_SIZE, targetLimit), 0)
        ]);
        
        const ids = new Set<number>(favResponse.tracks.map((track: { id: number }) => track.id));
        setFavoriteIds(ids);
        
        let allPoints = [...firstBatch.points];
        setMaxAvailablePoints(firstBatch.total);
        
        // Fetch additional batches if needed
        if (targetLimit > BATCH_SIZE && firstBatch.total > BATCH_SIZE) {
          const remainingToFetch = Math.min(targetLimit - BATCH_SIZE, firstBatch.total - BATCH_SIZE);
          const batches = Math.ceil(remainingToFetch / BATCH_SIZE);
          
          for (let i = 0; i < batches; i++) {
            const offset = BATCH_SIZE * (i + 1);
            const limit = Math.min(BATCH_SIZE, targetLimit - offset);
            
            const batch = await visualizationApi.getPoints(accessToken, limit, offset);
            allPoints = [...allPoints, ...batch.points];
            
            // Update UI progressively
            setPoints([...allPoints]);
          }
        }
        
        setPoints(allPoints);
        console.log(`Loaded ${allPoints.length} of ${firstBatch.total} points`);
      } catch (error) {
        console.error('Failed to fetch visualization points:', error);
        setError(error instanceof Error ? error.message : 'Failed to load visualization data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, pointLimit]);

  // Handle point selection
  const handleSelectPoint = (point: VisualizationPoint | null) => {
    setSelectedPoint(point);
  };

  // Get favorite points from loaded data - must be before early returns
  const favoritePoints = useMemo(
    () => points.filter(p => favoriteIds.has(p.id)),
    [points, favoriteIds]
  );

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.reset();
    }
    setSelectedPoint(null);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl border border-border">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center bg-background/50 backdrop-blur-sm gap-4 text-center rounded-xl border border-border">
        <div className="text-destructive font-bold text-xl">Error Loading Visualization</div>
        <div className="text-muted-foreground">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] overflow-hidden rounded-xl border border-border shadow-2xl bg-background/30 backdrop-blur-xl">
      <Scene 
        points={points} 
        onSelectPoint={handleSelectPoint}
        selectedPointId={selectedPoint?.id || null}
        cameraRef={cameraRef}
        spreadFactor={spreadFactor}
      />
      
      <Controls 
        onResetCamera={handleResetCamera}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        totalPoints={points.length}
        pointLimit={pointLimit}
        setPointLimit={setPointLimit}
        maxAvailablePoints={maxAvailablePoints}
        favoritePoints={favoritePoints}
        onSelectPoint={handleSelectPoint}
        spreadFactor={spreadFactor}
        setSpreadFactor={setSpreadFactor}
      />

      {selectedPoint && (
        <TrackCard 
          point={selectedPoint} 
          onClose={() => handleSelectPoint(null)}
          onFindSimilar={(id) => {
            // Find the point object for this id
            const point = points.find(p => p.id === id);
            if (point) handleSelectPoint(point);
          }}
        />
      )}
    </div>
  );
};

export default VisualizationPage;
