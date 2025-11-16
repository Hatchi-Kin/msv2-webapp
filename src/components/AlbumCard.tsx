import React from 'react';
import { Disc3 } from 'lucide-react';
import MediaCard from './MediaCard';
import { MOCHA_THEME } from '@/constants/theme';

interface AlbumCardProps {
  albumTitle: string;
  onClick: (albumTitle: string) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ albumTitle, onClick }) => {
  return (
    <MediaCard
      title={albumTitle}
      icon={<Disc3 className="h-6 w-6" style={{ color: MOCHA_THEME.colors.secondary }} />}
      onClick={() => onClick(albumTitle)}
    />
  );
};

export default AlbumCard;
