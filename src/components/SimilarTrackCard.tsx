import React from 'react';
import type { SimilarTrack } from '@/types/api';
import { Play, Sparkles, User } from 'lucide-react';
import { MOCHA_THEME } from '@/constants/theme';
import { getSimilarityBadgeColor } from '@/constants/similarity';

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
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: MOCHA_THEME.colors.background,
        border: `1px solid ${MOCHA_THEME.colors.border}`,
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.borderColor = MOCHA_THEME.colors.borderHover;
        target.style.transform = 'translateY(-4px)';
        target.style.boxShadow = '0 8px 24px rgba(139, 94, 60, 0.15)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.borderColor = MOCHA_THEME.colors.border;
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = 'none';
      }}
    >
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
      <div
        className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${MOCHA_THEME.colors.border} 0%, ${MOCHA_THEME.colors.borderHover} 100%)`
        }}
      >
        <div
          className="text-6xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ color: MOCHA_THEME.colors.primary, opacity: 0.4 }}
        >
          🎵
        </div>
        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{
            background: `radial-gradient(circle at top right, ${MOCHA_THEME.colors.primary} 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Track Info */}
      <div className="p-4 space-y-2">
        <h3
          className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]"
          style={{ color: MOCHA_THEME.colors.text }}
        >
          {track.title || track.filename}
        </h3>
        
        {track.artist && (
          <p
            className="text-xs truncate"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.semiTransparent }}
          >
            {track.artist}
          </p>
        )}
        
        {track.album && (
          <p
            className="text-xs truncate"
            style={{ color: MOCHA_THEME.colors.secondary, opacity: MOCHA_THEME.opacity.visible }}
          >
            {track.album}
          </p>
        )}
        
        {track.year && (
          <p
            className="text-xs"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.medium }}
          >
            {track.year}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(track.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-sm"
              style={{
                backgroundColor: MOCHA_THEME.colors.primary,
                color: MOCHA_THEME.colors.background,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 4px 12px rgba(139, 94, 60, 0.3)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Play className="w-3 h-3 fill-current" />
              Play
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFindSimilar(track.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
              style={{
                backgroundColor: MOCHA_THEME.colors.border,
                color: MOCHA_THEME.colors.primary,
                border: `1px solid ${MOCHA_THEME.colors.borderHover}`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = MOCHA_THEME.colors.primary;
                target.style.color = MOCHA_THEME.colors.background;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 4px 12px rgba(139, 94, 60, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = MOCHA_THEME.colors.border;
                target.style.color = MOCHA_THEME.colors.primary;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
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
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
              style={{
                backgroundColor: MOCHA_THEME.colors.border,
                color: MOCHA_THEME.colors.secondary,
                border: `1px solid ${MOCHA_THEME.colors.borderHover}`,
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = MOCHA_THEME.colors.secondary;
                target.style.color = MOCHA_THEME.colors.background;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 4px 12px rgba(206, 154, 106, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.backgroundColor = MOCHA_THEME.colors.border;
                target.style.color = MOCHA_THEME.colors.secondary;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
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
