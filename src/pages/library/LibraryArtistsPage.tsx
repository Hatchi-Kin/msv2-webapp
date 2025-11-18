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

  if (loading && artists.length === 0) {
    return <LoadingSpinner message="Loading artists..." />;
  }

  if (error) {
    return <ErrorMessage title="Error loading artists" message={error} />;
  }

  return (
    <div className="space-y-6">
      <LibraryHeader title="Your Music Library" subtitle="Browse by artist" />
      
      <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
        <ArtistsView
          artists={artists}
          totalArtists={totalArtists}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isLoadingMore={loading} // Show loading overlay if loading more
          onArtistClick={handleArtistClick}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default LibraryArtistsPage;
