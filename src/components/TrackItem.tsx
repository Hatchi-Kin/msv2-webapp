import React from 'react';
import type { MegasetTrack } from '@/types/api';
import { Play, Sparkles } from 'lucide-react';
import { MOCHA_THEME } from '@/constants/theme';

interface TrackItemProps {
  track: MegasetTrack;
  onClick: (track: MegasetTrack) => void;
  onFindSimilar?: (trackId: number) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onClick, onFindSimilar }) => {
  return (
    <div
      className="group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: 'transparent',
        border: '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.backgroundColor = MOCHA_THEME.colors.border;
        target.style.borderColor = MOCHA_THEME.colors.borderHover;
        target.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.backgroundColor = 'transparent';
        target.style.borderColor = 'transparent';
        target.style.transform = 'translateX(0)';
      }}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0" onClick={() => onClick(track)}>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: MOCHA_THEME.colors.border }}
        >
          <Play className="h-4 w-4" style={{ color: MOCHA_THEME.colors.primary }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: MOCHA_THEME.colors.text }}>
            {track.title || track.filename}
          </p>
          {track.artist && (
            <p
              className="text-xs truncate"
              style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.semiTransparent }}
            >
              {track.artist}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {track.tracknumber && (
          <span className="text-xs" style={{ color: MOCHA_THEME.colors.secondary }}>
            {track.tracknumber}
          </span>
        )}
        {onFindSimilar && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFindSimilar(track.id);
            }}
            className="p-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: MOCHA_THEME.colors.border,
              color: MOCHA_THEME.colors.primary,
              opacity: MOCHA_THEME.opacity.medium,
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = MOCHA_THEME.colors.borderHover;
              target.style.transform = 'scale(1.15)';
              target.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.backgroundColor = MOCHA_THEME.colors.border;
              target.style.transform = 'scale(1)';
              target.style.opacity = String(MOCHA_THEME.opacity.medium);
            }}
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackItem;
