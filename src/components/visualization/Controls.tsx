import React from 'react';
import { RotateCcw, Heart } from 'lucide-react';
import type { VisualizationPoint } from '@/lib/api/visualization';
import { SPREAD_RANGE } from './constants';

interface ControlsProps {
  onResetCamera: () => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  totalPoints: number;
  pointLimit: number;
  setPointLimit: (limit: number) => void;
  maxAvailablePoints: number;
  favoritePoints: VisualizationPoint[];
  onSelectPoint: (point: VisualizationPoint) => void;
  spreadFactor: number;
  setSpreadFactor: (factor: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onResetCamera,
  showFavorites,
  setShowFavorites,
  totalPoints,
  pointLimit,
  setPointLimit,
  maxAvailablePoints,
  favoritePoints,
  onSelectPoint,
  spreadFactor,
  setSpreadFactor
}) => {
  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2">
        <div className="text-xs font-mono text-muted-foreground px-1">
          {totalPoints.toLocaleString()} / {maxAvailablePoints.toLocaleString()} tracks
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onResetCamera}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Reset Camera"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`p-2 rounded-md transition-colors ${
              showFavorites ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            title="Favorites List"
          >
            <Heart size={20} fill={showFavorites ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Point Limit Slider */}
        <div className="px-1 pt-1 pb-2 border-t border-border/50 mt-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Density</span>
            <span>{pointLimit.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max={maxAvailablePoints > 0 ? maxAvailablePoints : 20000}
            step="1000"
            value={pointLimit}
            onChange={(e) => setPointLimit(Number(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Spread Factor Slider */}
        <div className="px-1 pt-1 pb-2 border-t border-border/50">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Spread</span>
            <span>×{spreadFactor.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={SPREAD_RANGE.MIN}
            max={SPREAD_RANGE.MAX}
            step={SPREAD_RANGE.STEP}
            value={spreadFactor}
            onChange={(e) => setSpreadFactor(Number(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            list="spread-markers"
          />
          <datalist id="spread-markers">
            <option value="1.5" label="×1.5"></option>
            <option value="2" label="×2"></option>
            <option value="2.5" label="×2.5"></option>
            <option value="3" label="×3"></option>
            <option value="3.5" label="×3.5"></option>   
          </datalist>
        </div>
      </div>

      {showFavorites && (
        <div className="bg-background/90 backdrop-blur-md border border-primary/20 rounded-lg p-0 shadow-xl animate-in slide-in-from-left-5 fade-in duration-200 w-64 max-h-[60vh] overflow-y-auto">
          <div className="p-3 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-md z-10">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Heart size={14} className="text-primary" fill="currentColor" />
              Favorites ({favoritePoints.length})
            </h3>
          </div>
          
          <div className="p-1">
            {favoritePoints.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No favorites found in current view.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {favoritePoints.map(point => (
                  <button
                    key={point.id}
                    onClick={() => {
                      onSelectPoint(point);
                      // Optional: close list on select? keeping it open for now
                    }}
                    className="text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-xs transition-colors group"
                  >
                    <div className="font-medium truncate group-hover:text-primary transition-colors">
                      {point.title || 'Unknown Title'}
                    </div>
                    <div className="text-muted-foreground truncate text-[10px]">
                      {point.artist || 'Unknown Artist'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
