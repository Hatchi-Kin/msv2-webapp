import React from "react";
import { Music, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/context/PlayerContext";
import TrackItem from "../TrackItem";
import EmptyState from "@/components/ui/EmptyState";
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
  const { playQueue } = usePlayer();

  if (tracks.length === 0) {
    return (
      <EmptyState
        icon={Music}
        message={`No tracks found for ${selectedAlbum}.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {tracks.length > 0 && (
        <Button
          onClick={() => playQueue(tracks)}
          className="flex items-center space-x-2 rounded-xl font-semibold"
        >
          <Play className="h-4 w-4" />
          <span>Play All</span>
        </Button>
      )}
      <div className="space-y-1">
        {tracks.map((track) => (
          <TrackItem key={track.id} track={track} onFindSimilar={onFindSimilar} />
        ))}
      </div>
    </div>
  );
};

export default TracksView;
