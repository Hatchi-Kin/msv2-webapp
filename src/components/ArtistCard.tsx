import React from "react";
import { User } from "lucide-react";
import MediaCard from "./MediaCard";

interface ArtistCardProps {
  artistName: string;
  onClick: (artistName: string) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artistName, onClick }) => {
  return (
    <MediaCard
      title={artistName}
      icon={<User className="h-6 w-6 text-primary" />}
      onClick={() => onClick(artistName)}
    />
  );
};

export default ArtistCard;
