import React from "react";
import type { SimilarTrack } from "@/types/api";
import { Play, Sparkles, User } from "lucide-react";
import { getSimilarityBadgeColor } from "@/constants/similarity";

interface SimilarTrackCardProps {
  similarTrack: SimilarTrack;
  onPlay: (trackId: number) => void;
  onFindSimilar: (trackId: number) => void;
  onViewArtist: (artistName: string) => void;
}

const SimilarTrackCard: React.FC<SimilarTrackCardProps> = ({
  similarTrack,
  onPlay,
  onFindSimilar,
  onViewArtist,
}) => {
  const { track, similarity_score } = similarTrack;

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
          <p className="text-xs truncate text-secondary opacity-70">
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
                onPlay(track.id);
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

          {track.artist_folder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewArtist(track.artist_folder!);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-muted text-secondary border border-muted-foreground hover:bg-secondary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md"
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
