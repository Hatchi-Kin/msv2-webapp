import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracks } from "@/hooks/useTracks";
import { usePlayer } from "@/context/PlayerContext";
import LibraryHeader from "@/components/library/LibraryHeader";
import TracksView from "@/components/library/views/TracksView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { MegasetTrack } from "@/types/api";

const LibraryTracksPage: React.FC = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();
  const { playTrack, playQueue } = usePlayer();
  
  const decodedAlbumName = albumName ? decodeURIComponent(albumName) : "";
  
  const { tracks, loading, error } = useTracks(decodedAlbumName);

  const handleTrackClick = (track: MegasetTrack) => {
    // Play the track and set the queue
    // Find index of clicked track
    const index = tracks.findIndex(t => t.id === track.id);
    if (index !== -1) {
      playQueue(tracks, index);
    } else {
      playTrack(track);
    }
  };

  const handleFindSimilar = (trackId: number) => {
    navigate(`/library/similar/${trackId}`);
  };

  if (loading) {
    return <LoadingSpinner message={`Loading tracks for ${decodedAlbumName}...`} />;
  }

  if (error) {
    return <ErrorMessage title="Error loading tracks" message={error} />;
  }

  return (
    <div className="space-y-6">
      <LibraryHeader 
        title={`Tracks in ${decodedAlbumName}`} 
        subtitle="All tracks in this album"
        showBack
      />
      
      <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
        <TracksView
          tracks={tracks}
          selectedAlbum={decodedAlbumName}
          onTrackClick={handleTrackClick}
          onFindSimilar={handleFindSimilar}
        />
      </div>
    </div>
  );
};

export default LibraryTracksPage;
