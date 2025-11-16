import React from 'react';
import { User } from 'lucide-react';
import MediaCard from './MediaCard';
import { MOCHA_THEME } from '@/constants/theme';

interface ArtistCardProps {
  artistName: string;
  onClick: (artistName: string) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artistName, onClick }) => {
  return (
    <MediaCard
      title={artistName}
      icon={<User className="h-6 w-6" style={{ color: MOCHA_THEME.colors.primary }} />}
      onClick={() => onClick(artistName)}
    />
  );
};

export default ArtistCard;
