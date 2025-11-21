import React, { useState } from "react";
import { RotateCcw, Settings2, X, Filter } from "lucide-react";
import type { VisualizationStats } from "@/lib/api/visualization";
import { SPREAD_RANGE } from "./constants";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ControlsProps {
  onResetCamera: () => void;
  totalPoints: number;
  pointLimit: number;
  setPointLimit: (limit: number) => void;
  maxAvailablePoints: number;
  spreadFactor: number;
  setSpreadFactor: (factor: number) => void;
  vizType: "default" | "umap";
  setVizType: (type: "default" | "umap") => void;
  stats: VisualizationStats | null;
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
}

const Controls: React.FC<ControlsProps> = ({
  onResetCamera,
  totalPoints,
  pointLimit,
  setPointLimit,
  maxAvailablePoints,
  spreadFactor,
  setSpreadFactor,
  vizType,
  setVizType,
  stats,
  selectedGenre,
  onSelectGenre,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 items-start">
      {/* Mobile Toggle / Desktop Collapse */}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90"
        title={isOpen ? "Hide Controls" : "Show Controls"}
      >
        {isOpen ? <X size={20} /> : <Settings2 size={20} />}
      </Button>

      {isOpen && (
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg flex flex-col gap-2 w-64 animate-in slide-in-from-left-5 fade-in duration-200">
          <div className="text-xs font-mono text-muted-foreground px-1">
            {totalPoints.toLocaleString()} /{" "}
            {maxAvailablePoints.toLocaleString()} tracks
            {stats && ` • ${stats.total_clusters} clusters`}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onResetCamera}
              title="Reset Camera"
            >
              <RotateCcw size={20} />
            </Button>
          </div>

          {/* Point Limit Slider */}
          <div className="px-1 pt-1 pb-2 border-t border-border/50 mt-1 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <Label className="text-xs">Density</Label>
              <span>{pointLimit.toLocaleString()}</span>
            </div>
            <Slider
              min={1000}
              max={maxAvailablePoints > 0 ? maxAvailablePoints : 20000}
              step={1000}
              value={[pointLimit]}
              onValueChange={(value) => setPointLimit(value[0])}
            />
          </div>

          {/* Spread Factor Slider */}
          <div className="px-1 pt-1 pb-2 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <Label className="text-xs">Spread</Label>
              <span>×{spreadFactor.toFixed(1)}</span>
            </div>
            <Slider
              min={SPREAD_RANGE.MIN}
              max={SPREAD_RANGE.MAX}
              step={SPREAD_RANGE.STEP}
              value={[spreadFactor]}
              onValueChange={(value) => setSpreadFactor(value[0])}
            />
          </div>

          {/* Visualization Type Toggle */}
          <div className="px-1 pt-1 pb-2 border-t border-border/50 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <Label className="text-xs">Algorithm</Label>
            </div>
            <div className="flex bg-muted rounded-lg p-1 gap-1">
              <button
                onClick={() => setVizType("default")}
                className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-all ${
                  vizType === "default"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                t-SNE
              </button>
              <button
                onClick={() => setVizType("umap")}
                className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-all ${
                  vizType === "umap"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                UMAP
              </button>
            </div>
          </div>

          {/* Genre Filter */}
          {stats && stats.top_genres.length > 0 && (
            <div className="px-1 pt-1 pb-2 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <Label className="text-xs flex items-center gap-1">
                  <Filter size={10} /> Top Genres
                </Label>
                {selectedGenre && (
                  <button
                    onClick={() => onSelectGenre(null)}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                {stats.top_genres.slice(0, 10).map((g) => (
                  <button
                    key={g.genre}
                    onClick={() =>
                      onSelectGenre(selectedGenre === g.genre ? null : g.genre)
                    }
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                      selectedGenre === g.genre
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                    title={`${g.count} tracks`}
                  >
                    {g.genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Controls;
