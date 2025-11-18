import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracks } from "@/hooks/useTracks";
import LibraryHeader from "@/components/library/LibraryHeader";
import TracksView from "@/components/library/views/TracksView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

const LibraryTracksPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();
  
  const decodedAlbumName = albumName ? decodeURIComponent(albumName) : "";
  
  const { tracks, loading, error } = useTracks(decodedAlbumName);

  const handleFindSimilar = (trackId: number) => {
    navigate(`/library/similar/${trackId}`);
  };

  return (
    <div className="space-y-6">
      <LibraryHeader 
        title={`Tracks in ${decodedAlbumName}`} 
        subtitle="All tracks in this album"
        showBack
      />
      
      <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
        {loading ? (
          <LoadingSpinner message={`Loading tracks for ${decodedAlbumName}...`} />
        ) : error ? (
          <ErrorMessage title="Error loading tracks" message={error} />
        ) : (
          <TracksView
            tracks={tracks}
            selectedAlbum={decodedAlbumName}
            onFindSimilar={handleFindSimilar}
          />
        )}
      </div>
    </div>
  );
};

export default LibraryTracksPage;
