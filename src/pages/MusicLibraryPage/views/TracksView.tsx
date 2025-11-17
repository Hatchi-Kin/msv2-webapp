import React from "react";
import { Music } from "lucide-react";
import TrackItem from "@/components/TrackItem";
import type { MegasetTrack } from "@/types/api";

interface TracksViewProps {
  tracks: MegasetTrack[];
  selectedAlbum: string | null;
  onTrackClick: (track: MegasetTrack) => void;
  onFindSimilar: (trackId: number) => void;
}

const TracksView: React.FC<TracksViewProps> = ({
  tracks,
  selectedAlbum,
  onTrackClick,
  onFindSimilar,
}) => {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
        <p className="text-sm text-foreground opacity-70">
          No tracks found for {selectedAlbum}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tracks.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          onClick={onTrackClick}
          onFindSimilar={onFindSimilar}
        />
      ))}
    </div>
  );
};

export default TracksView;
