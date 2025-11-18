import React from "react";
import { Music } from "lucide-react";
import ArtistCard from "@/components/ArtistCard";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";

interface ArtistsViewProps {
  artists: string[];
  totalArtists: number;
  currentPage: number;
  itemsPerPage: number;
  isLoadingMore: boolean;
  onArtistClick: (artistName: string) => void;
  onPageChange: (page: number) => void;
}

const ArtistsView: React.FC<ArtistsViewProps> = ({
  artists,
  totalArtists,
  currentPage,
  itemsPerPage,
  isLoadingMore,
  onArtistClick,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalArtists / itemsPerPage);

  if (artists.length === 0) {
    return <EmptyState icon={Music} message="No artists found in your library." />;
  }

  return (
    <>
      <div className="relative">
        {/* Subtle loading overlay */}
        {isLoadingMore && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border shadow-lg">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm text-foreground">Loading...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.map((artistName) => (
            <ArtistCard
              key={artistName}
              artistName={artistName}
              onClick={onArtistClick}
            />
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalArtists}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        itemLabel="artists"
      />
    </>
  );
};

export default ArtistsView;
