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
        className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold z-10"
        style={{
          backgroundColor: badgeColor.bg,
          color: badgeColor.text,
        }}
      >
        {similarityPercent}%
      </div>

      {/* Album Art Placeholder */}
      <div className="w-full aspect-square flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-muted to-muted-foreground">
        <div className="text-6xl font-bold transition-transform duration-300 group-hover:scale-110 text-primary opacity-40">
          🎵
        </div>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-20 bg-gradient-radial from-primary to-transparent" />
      </div>

      {/* Track Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-foreground">
          {track.title || track.filename}
        </h3>

        {track.artist && (
          <p className="text-xs truncate text-foreground opacity-60">
            {track.artist}
          </p>
        )}

        {track.album && (
          <p className="text-xs truncate text-foreground opacity-60">
            {track.album}
          </p>
        )}

        {track.year && (
          <p className="text-xs text-foreground opacity-50">{track.year}</p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playTrack(track);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Play className="w-3 h-3 fill-current" />
              Play
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onFindSimilar(track.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md"
            >
              <Sparkles className="w-3 h-3" />
              Similar
            </button>
          </div>

          <div className="flex gap-2">
            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                isFavorite(track.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground"
              } hover:-translate-y-0.5 hover:shadow-md`}
            >
              <Heart
                className={`w-3 h-3 ${
                  isFavorite(track.id) ? "fill-current" : ""
                }`}
              />
              {isFavorite(track.id) ? "Favorited" : "Favorite"}
            </button>

            {/* Add to playlist button */}
            <div
              className="flex-1 relative"
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlaylistMenu(!showPlaylistMenu);
                }}
                disabled={isAddingToPlaylist}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
              >
                <ListPlus className="w-3 h-3" />
                Playlist
              </button>

              {/* Playlist dropdown */}
              {showPlaylistMenu && (
                <div
                  className="absolute left-0 bottom-full mb-2 bg-background border-2 border-primary rounded-xl shadow-2xl z-[100] min-w-[216px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 max-h-[180px] overflow-y-auto">
                    {playlists.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-foreground font-medium">
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
                          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 mb-1 last:mb-0"
                        >
                          <div className="font-semibold">{playlist.name}</div>
                          <div className="text-xs opacity-80 font-medium">
                            {playlist.track_count}/20
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {track.artist_folder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewArtist(track.artist_folder!);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-muted text-foreground border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md"
            >
              <User className="w-3 h-3" />
              View Artist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarTrackCard;
