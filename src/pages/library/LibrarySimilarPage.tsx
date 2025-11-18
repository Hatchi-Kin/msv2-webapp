import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSimilarTracks } from "@/hooks/useSimilarTracks";
import LibraryHeader from "@/components/library/LibraryHeader";
import SimilarTracksView from "@/components/library/views/SimilarTracksView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

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

  if (loading) {
    return <LoadingSpinner message="Finding similar tracks..." />;
  }

  if (error) {
    return <ErrorMessage title="Error finding similar tracks" message={error} />;
  }

  return (
    <div className="space-y-6">
      <LibraryHeader 
        title="Similar Tracks" 
        subtitle={originTrack ? `Similar to: ${originTrack.title || originTrack.filename}` : "Recommendations"}
        showBack
      >
        {originTrack && originTrack.artist && (
           <div className="flex items-center gap-2 mt-2">
             <div className="px-3 py-1 rounded-lg bg-muted border border-muted-foreground">
               <p className="text-sm text-foreground">
                 <span className="opacity-70">by {originTrack.artist}</span>
               </p>
             </div>
           </div>
        )}
      </LibraryHeader>
      
      <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
        <SimilarTracksView
          similarTracks={similarTracks}
          onFindSimilar={handleFindSimilar}
          onViewArtist={handleViewArtist}
        />
      </div>
    </div>
  );
};

export default LibrarySimilarPage;
