import React, { useState } from "react";
import type { MegasetTrack } from "@/types/api";
import { Play, Sparkles, Heart, ListPlus } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";

interface TrackItemProps {
  track: MegasetTrack;
  onFindSimilar?: (trackId: number) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  onFindSimilar,
}) => {
  const { playTrack } = usePlayer();
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    playlists,
    addTrackToPlaylist,
  } = useLibrary();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const [isPlayLoading, setIsPlayLoading] = useState(false);
  const closeTimeoutRef = React.useRef<number | null>(null);

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowPlaylistMenu(false);
    }, 300); // 300ms delay
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFavorite(track.id)) {
        await removeFavorite(track.id);
      } else {
        await addFavorite(track.id);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    setIsAddingToPlaylist(true);
    try {
      await addTrackToPlaylist(playlistId, track.id);
      setShowPlaylistMenu(false);
    } catch (error) {
      console.error("Failed to add to playlist:", error);
    } finally {
      setIsAddingToPlaylist(false);
    }
  };

  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 bg-transparent border border-transparent hover:bg-muted hover:border-muted-foreground hover:translate-x-1">
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
        <button
          onClick={handlePlayClick}
          disabled={isPlayLoading}
          className={`p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100 ${isPlayLoading ? 'opacity-30 cursor-wait' : ''}`}
          title="Play track"
        >
          <Play className="h-5 w-5" />
        </button>

        {/* Add to Favorites Button */}
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isFavorite(track.id)
              ? "bg-primary/20 text-primary opacity-100"
              : "bg-transparent text-primary opacity-50 hover:bg-primary/10"
          } hover:scale-110 hover:opacity-100`}
          title={
            isFavorite(track.id) ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            className={`h-5 w-5 ${isFavorite(track.id) ? "fill-current" : ""}`}
          />
        </button>

        {/* Add to Playlist Button */}
        <div
          className="relative"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylistMenu(!showPlaylistMenu);
            }}
            className="p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
            title="Add to playlist"
            disabled={isAddingToPlaylist}
          >
            <ListPlus className="h-5 w-5" />
          </button>

          {/* Playlist dropdown menu */}
          {showPlaylistMenu && (
            <div
              className="absolute right-0 bottom-full mb-2 bg-background border-2 border-primary rounded-xl shadow-2xl z-[100] min-w-[240px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 max-h-[240px] overflow-y-auto">
                {playlists.length === 0 ? (
                  <div className="px-4 py-3 text-base text-foreground font-medium">
                    No playlists yet
                  </div>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlaylist(playlist.id);
                      }}
                      disabled={
                        isAddingToPlaylist || playlist.track_count >= 20
                      }
                      className="w-full text-left px-4 py-3 text-base rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1 last:mb-0"
                    >
                      <div className="font-semibold">{playlist.name}</div>
                      <div className="text-sm opacity-80 font-medium">
                        {playlist.track_count}/20 tracks
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
