import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSimilarTracks } from "@/hooks/useSimilarTracks";
import LibraryHeader from "./LibraryHeader";
import SimilarTracksView from "./views/SimilarTracksView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";

const LibrarySimilarPage: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  
  const id = trackId ? parseInt(trackId, 10) : undefined;
  
  const { similarTracks, originTrack, loading, error } = useSimilarTracks(id);

  const handleFindSimilar = (newTrackId: number) => {
    navigate(`/library/similar/${newTrackId}`);
  };

  const handleViewArtist = (artistName: string) => {
    navigate(`/library/artists/${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="space-y-6 pt-6">
      <LibraryHeader 
        title="Similar Tracks" 
        subtitle={
          originTrack 
            ? `${originTrack.title || originTrack.filename}${originTrack.artist ? ` • ${originTrack.artist}` : ''}`
            : "Recommendations"
        }
        showBack
      />
      
      <div className="glass-panel p-6 rounded-3xl min-h-[650px]">
        {loading ? (
          <LoadingSpinner message="Finding similar tracks..." />
        ) : error ? (
          <ErrorMessage title="Error finding similar tracks" message={error} />
        ) : (
          <SimilarTracksView
            similarTracks={similarTracks}
            onFindSimilar={handleFindSimilar}
            onViewArtist={handleViewArtist}
          />
        )}
      </div>
    </div>
  );
};

export default LibrarySimilarPage;
