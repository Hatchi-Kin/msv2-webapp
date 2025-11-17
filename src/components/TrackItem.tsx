import React from "react";
import type { MegasetTrack } from "@/types/api";
import { Play, Sparkles, Heart, ListPlus } from "lucide-react";

interface TrackItemProps {
  track: MegasetTrack;
  onClick: (track: MegasetTrack) => void;
  onFindSimilar?: (trackId: number) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onClick,
  onFindSimilar,
}) => {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 bg-transparent border border-transparent hover:bg-muted hover:border-muted-foreground hover:translate-x-1">
      {/* Track Number */}
      <div className="flex-shrink-0 w-8 text-center">
        {track.tracknumber ? (
          <span className="text-sm font-medium text-secondary">
            {track.tracknumber}
          </span>
        ) : (
          <span className="text-sm text-foreground opacity-30">—</span>
        )}
      </div>

      {/* Track Info - clickable area */}
      <div className="flex-1 min-w-0" onClick={() => onClick(track)}>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement play functionality
            console.log("Play track:", track.id);
          }}
          className="p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
          title="Play track"
        >
          <Play className="h-5 w-5" />
        </button>

        {/* Add to Favorites Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement add to favorites functionality
            console.log("Add to favorites:", track.id);
          }}
          className="p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
          title="Add to favorites"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Add to Playlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement add to playlist functionality
            console.log("Add to playlist:", track.id);
          }}
          className="p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
          title="Add to playlist"
        >
          <ListPlus className="h-5 w-5" />
        </button>

        {/* Find Similar Button */}
        {onFindSimilar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFindSimilar(track.id);
            }}
            className="p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
            title="Find similar tracks"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackItem;
