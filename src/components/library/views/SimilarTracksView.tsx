import React from "react";
import { Music } from "lucide-react";
import SimilarTrackCard from "@/components/SimilarTrackCard";
import EmptyState from "@/components/EmptyState";
import type { SimilarTrack } from "@/types/api";

interface SimilarTracksViewProps {
  similarTracks: SimilarTrack[];
  onFindSimilar: (trackId: number) => void;
  onViewArtist: (artistName: string) => void;
}

const SimilarTracksView: React.FC<SimilarTracksViewProps> = ({
  similarTracks,
  onFindSimilar,
  onViewArtist,
}) => {
  if (similarTracks.length === 0) {
    return <EmptyState icon={Music} message="No similar tracks found." />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {similarTracks.map((similarTrack, index) => (
        <div
          key={similarTrack.track.id}
          style={{
            animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
          }}
        >
          <SimilarTrackCard
            similarTrack={similarTrack}
            onFindSimilar={onFindSimilar}
            onViewArtist={onViewArtist}
          />
        </div>
      ))}
    </div>
  );
};

export default SimilarTracksView;
