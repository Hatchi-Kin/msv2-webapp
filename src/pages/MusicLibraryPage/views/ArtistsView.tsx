import React from "react";
import { Music } from "lucide-react";
import ArtistCard from "@/components/ArtistCard";
import Pagination from "@/components/Pagination";

interface ArtistsViewProps {
  artists: string[];
  paginatedArtists: string[];
  currentPage: number;
  itemsPerPage: number;
  onArtistClick: (artistName: string) => void;
  onPageChange: (page: number) => void;
}

const ArtistsView: React.FC<ArtistsViewProps> = ({
  artists,
  paginatedArtists,
  currentPage,
  itemsPerPage,
  onArtistClick,
  onPageChange,
}) => {
  const totalPages = Math.ceil(artists.length / itemsPerPage);

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
        <p className="text-sm text-foreground opacity-70">
          No artists found in your library.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {paginatedArtists.map((artistName) => (
          <ArtistCard
            key={artistName}
            artistName={artistName}
            onClick={onArtistClick}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={artists.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        itemLabel="artists"
      />
    </>
  );
};

export default ArtistsView;
