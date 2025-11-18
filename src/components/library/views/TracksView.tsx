import React from "react";
import { Music } from "lucide-react";
import TrackItem from "@/components/TrackItem";
import EmptyState from "@/components/EmptyState";
import type { MegasetTrack } from "@/types/api";

interface TracksViewProps {
  tracks: MegasetTrack[];
  selectedAlbum: string | null;
  onFindSimilar: (trackId: number) => void;
}

const TracksView: React.FC<TracksViewProps> = ({
  tracks,
  selectedAlbum,
  onFindSimilar,
}) => {
  if (tracks.length === 0) {
    return <EmptyState icon={Music} message={`No tracks found for ${selectedAlbum}.`} />;
  }

  return (
    <div className="space-y-1">
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          onFindSimilar={onFindSimilar}
        />
      ))}
    </div>
  );
};

export default TracksView;
