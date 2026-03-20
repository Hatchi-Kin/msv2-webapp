import React from "react";
import type { ScoredTrack } from "@/types/api";
import { Play, Sparkles, User, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistDropdown } from "./PlaylistDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { getSimilarityBadgeColor } from "@/constants/similarity";
import { usePlayer } from "@/context/PlayerContext";

interface ScoredTrackCardProps {
  scoredTrack: ScoredTrack;
  onFindSimilar: (trackId: number) => void;
  onViewArtist: (artistName: string) => void;
}

const ScoredTrackCard: React.FC<ScoredTrackCardProps> = ({
  scoredTrack,
  onFindSimilar,
  onViewArtist,
}) => {
  const { track, similarity_score } = scoredTrack;
  const { playTrack } = usePlayer();

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
      <div className="w-full aspect-[3/2] flex items-center justify-center relative overflow-hidden bg-background border-b border-border">
        {/* Galaxy radial background effect */}
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background: `radial-gradient(circle at center, var(--viz-glow-1) 0%, var(--viz-glow-2) 40%, transparent 70%)`,
          }}
        />
        {/* Twinkling star-like dots grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(var(--star-color) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
        />
        <Disc3 className="w-12 h-12 relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-180 text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] opacity-70" />
      </div>

      {/* Track Info */}
      <div className="p-2.5 space-y-1.5">
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
        <div className="flex gap-1.5 pt-1.5">
          <Button
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
            className="h-8 w-8 hover:scale-110 hover:shadow-md"
            title="Play"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFindSimilar(track.id);
            }}
            className="h-8 w-8 hover:scale-110"
            title="Find Similar"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>

          <FavoriteButton trackId={track.id} variant="icon" />

          <PlaylistDropdown trackId={track.id} variant="button" />

          {track.artist_folder && (
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onViewArtist(track.artist_folder!);
              }}
              className="h-8 w-8 ml-auto hover:scale-110"
              title="View Artist"
            >
              <User className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoredTrackCard;
