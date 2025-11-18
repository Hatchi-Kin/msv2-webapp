import React from "react";
import { Music } from "lucide-react";
import SimilarTrackCard from "@/components/SimilarTrackCard";
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
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
        <p className="text-sm text-foreground opacity-70">
          No similar tracks found.
        </p>
      </div>
    );
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
