import React, { useState } from "react";
import type { SimilarTrack } from "@/types/api";
import { Play, Sparkles, User, Heart, ListPlus } from "lucide-react";
import { getSimilarityBadgeColor } from "@/constants/similarity";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";

interface SimilarTrackCardProps {
  similarTrack: SimilarTrack;
  onFindSimilar: (trackId: number) => void;
  onViewArtist: (artistName: string) => void;
}

const SimilarTrackCard: React.FC<SimilarTrackCardProps> = ({
  similarTrack,
  onFindSimilar,
  onViewArtist,
}) => {
  const { track, similarity_score } = similarTrack;
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

  // Convert cosine distance to similarity percentage
  const similarityPercent = ((1 - similarity_score) * 100).toFixed(1);
  const similarityValue = parseFloat(similarityPercent);

  // Get badge color based on similarity percentage
  const badgeColor = getSimilarityBadgeColor(similarityValue);

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-background border border-border hover:border-muted-foreground hover:-translate-y-1 hover:shadow-lg">
      {/* Similarity Badge */}
      <div
        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold z-10"
        style={{
          backgroundColor: badgeColor.bg,
          color: badgeColor.text,
        }}
      >
        {similarityPercent}%
      </div>

      {/* Album Art Placeholder - Compact */}
      <div className="w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-muted to-muted-foreground">
        <div className="text-4xl font-bold transition-transform duration-300 group-hover:scale-110 text-primary opacity-40">
          🎵
        </div>
      </div>

      {/* Track Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm line-clamp-1 text-foreground">
          {track.title || track.filename}
        </h3>

        {track.artist && (
          <p className="text-xs truncate text-foreground opacity-60">
            {track.artist}
          </p>
        )}

        {track.album && (
          <p className="text-xs truncate text-foreground opacity-50">
            {track.album}
          </p>
        )}

        {/* Action Buttons - Compact icon-only row */}
        <div className="flex gap-1.5 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
            className="p-2 rounded-lg transition-all duration-300 bg-primary text-primary-foreground hover:scale-110 hover:shadow-md"
            title="Play"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onFindSimilar(track.id);
            }}
            className="p-2 rounded-lg transition-all duration-300 bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110"
            title="Find Similar"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isFavorite(track.id)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground"
            } hover:scale-110`}
            title={isFavorite(track.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite(track.id) ? "fill-current" : ""
              }`}
            />
          </button>

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
              disabled={isAddingToPlaylist}
              className="p-2 rounded-lg transition-all duration-300 bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 disabled:opacity-50"
              title="Add to Playlist"
            >
              <ListPlus className="w-3.5 h-3.5" />
            </button>

            {showPlaylistMenu && (
              <div
                className="absolute left-0 bottom-full mb-2 bg-background border-2 border-primary rounded-xl shadow-2xl z-[100] min-w-[200px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 max-h-[180px] overflow-y-auto">
                  {playlists.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-foreground">
                      No playlists
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
                        className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 mb-1 last:mb-0"
                      >
                        <div className="font-semibold">{playlist.name}</div>
                        <div className="text-xs opacity-80">
                          {playlist.track_count}/20
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {track.artist_folder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewArtist(track.artist_folder!);
              }}
              className="p-2 rounded-lg transition-all duration-300 bg-muted text-foreground border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 ml-auto"
              title="View Artist"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarTrackCard;
