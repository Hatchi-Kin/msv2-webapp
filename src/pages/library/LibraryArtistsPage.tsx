import React from "react";
import { useNavigate } from "react-router-dom";
import { useArtists } from "@/hooks/useArtists";
import LibraryHeader from "@/components/library/LibraryHeader";
import ArtistsView from "@/components/library/views/ArtistsView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

const LibraryArtistsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    artists,
    totalArtists,
    loading,
    error,
    currentPage,
    itemsPerPage,
    setPage,
  } = useArtists();

  const handleArtistClick = (artistName: string) => {
    navigate(`/library/artists/${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="space-y-6">
      <LibraryHeader title="Your Music Library" subtitle="Browse by artist" />
      
      <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
        {loading && artists.length === 0 ? (
          <LoadingSpinner message="Loading artists..." />
        ) : error ? (
          <ErrorMessage title="Error loading artists" message={error} />
        ) : (
          <ArtistsView
            artists={artists}
            totalArtists={totalArtists}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoadingMore={loading}
            onArtistClick={handleArtistClick}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default LibraryArtistsPage;
