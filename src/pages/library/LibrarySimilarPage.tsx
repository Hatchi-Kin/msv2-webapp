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
      
      <div className="glass-panel p-6 rounded-3xl min-h-[500px]">
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
