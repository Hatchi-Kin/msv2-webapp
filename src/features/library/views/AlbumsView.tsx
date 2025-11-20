import React from "react";
import { Music } from "lucide-react";
import AlbumCard from "../AlbumCard";
import EmptyState from "@/components/ui/EmptyState";

interface AlbumsViewProps {
  albums: string[];
  selectedArtist: string | null;
  onAlbumClick: (albumTitle: string) => void;
}

const AlbumsView: React.FC<AlbumsViewProps> = ({
  albums,
  selectedArtist,
  onAlbumClick,
}) => {
  if (albums.length === 0) {
    return <EmptyState icon={Music} message={`No albums found for ${selectedArtist}.`} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {albums.map((albumTitle) => (
        <AlbumCard
          key={albumTitle}
          albumTitle={albumTitle}
          onClick={onAlbumClick}
        />
      ))}
    </div>
  );
};

export default AlbumsView;
