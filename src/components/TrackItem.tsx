import React from 'react';
import type { MegasetTrack } from '@/types/api';
import { Play } from 'lucide-react';
import { MOCHA_THEME } from '@/constants/theme';

interface TrackItemProps {
  track: MegasetTrack;
  onClick: (track: MegasetTrack) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onClick }) => {
  return (
    <div
      className="group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300"
      onClick={() => onClick(track)}
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
      <div className="flex items-center space-x-3 flex-1 min-w-0">
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
      {track.tracknumber && (
        <span className="text-xs flex-shrink-0 ml-2" style={{ color: MOCHA_THEME.colors.secondary }}>
          {track.tracknumber}
        </span>
      )}
    </div>
  );
};

export default TrackItem;
