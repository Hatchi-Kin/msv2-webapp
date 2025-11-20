import React, { useState } from "react";
import type { MegasetTrack } from "@/types/api";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistDropdown } from "./PlaylistDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";

interface TrackItemProps {
  track: MegasetTrack;
  onFindSimilar?: (trackId: number) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onFindSimilar,
}) => {
  const { playTrack } = usePlayer();
  const [isPlayLoading, setIsPlayLoading] = useState(false);

  const handlePlayClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayLoading) return;

    setIsPlayLoading(true);
    playTrack(track);
    
    // Simple debounce/cooldown
    setTimeout(() => {
      setIsPlayLoading(false);
    }, 1000);
  };

  return (
    <div className="group flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-xl transition-all duration-300 bg-transparent border border-transparent hover:bg-accent hover:border-primary/20 hover:translate-x-1">
      {/* Track Number - Hidden on mobile */}
      <div className="hidden md:block flex-shrink-0 w-8 text-center">
        {track.tracknumber ? (
          <span className="text-sm font-medium text-foreground opacity-60">
            {track.tracknumber}
          </span>
        ) : (
          <span className="text-sm text-foreground opacity-30">—</span>
        )}
      </div>

      {/* Track Info - NOT clickable anymore */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">
          {track.title || track.filename}
        </p>
        {track.artist && (
          <p className="text-xs truncate text-foreground opacity-60">
            {track.artist}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Play Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayClick}
          disabled={isPlayLoading}
          className={cn(
            "h-8 w-8 md:h-10 md:w-10 hover:scale-110 hover:bg-primary/10",
            isPlayLoading && "opacity-30 cursor-wait"
          )}
          title="Play track"
        >
          <Play className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        {/* Add to Favorites Button */}
        <div className="scale-90 md:scale-100">
          <FavoriteButton trackId={track.id} variant="icon" />
        </div>

        {/* Add to Playlist Button */}
        <div className="scale-90 md:scale-100">
          <PlaylistDropdown trackId={track.id} variant="button" />
        </div>

        {/* Find Similar Button */}
        {onFindSimilar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFindSimilar(track.id);
            }}
            className="h-8 w-8 md:h-10 md:w-10 hover:scale-110 hover:bg-primary/10"
            title="Find similar tracks"
          >
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrackItem;
