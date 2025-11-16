import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MOCHA_THEME } from '@/constants/theme';
import { useThemeHover } from '@/hooks/useThemeHover';

interface MediaCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

/**
 * Generic card component for artists, albums, etc.
 */
const MediaCard: React.FC<MediaCardProps> = ({ title, icon, onClick }) => {
  const { handleCardMouseEnter, handleCardMouseLeave } = useThemeHover();

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 rounded-2xl"
      onClick={onClick}
      style={{
        backgroundColor: MOCHA_THEME.colors.background,
        border: `1px solid ${MOCHA_THEME.colors.border}`,
        boxShadow: MOCHA_THEME.shadows.sm,
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      <CardContent className="p-4 space-y-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full mx-auto transition-all duration-300"
          style={{ backgroundColor: MOCHA_THEME.colors.border }}
        >
          {icon}
        </div>
        <div className="text-center">
          <p
            className="font-medium text-sm leading-tight line-clamp-2"
            style={{ color: MOCHA_THEME.colors.text }}
          >
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
