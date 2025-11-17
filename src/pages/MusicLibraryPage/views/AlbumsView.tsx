import React from "react";
import { Music } from "lucide-react";
import AlbumCard from "@/components/AlbumCard";

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
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
        <p className="text-sm text-foreground opacity-70">
          No albums found for {selectedArtist}.
        </p>
      </div>
    );
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
