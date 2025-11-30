import React, { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Sparkles } from "lucide-react";
import { useGemFinderAgent } from "./hooks/useGemFinderAgent";
import { PlaylistSelection } from "./components/PlaylistSelection";
import { AgentView } from "./components/AgentView";
import { TrackCard } from "@/lib/api/agent";
import { MegasetTrack } from "@/types/api";

const GemFinderPage: React.FC = () => {
  const { playlists } = useLibrary();
  const { playTrack } = usePlayer();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null
  );

  const {
    uiState,
    loading,
    loadingMessage,
    pendingFunFact,
    startAgent,
    handleAction,
    resetAgent,
  } = useGemFinderAgent();

  const handlePlaylistSelect = (playlistId: number) => {
    setSelectedPlaylistId(playlistId);
    startAgent(playlistId);
  };

  const handleBack = () => {
    setSelectedPlaylistId(null);
    resetAgent();
  };

  const handlePlayTrack = (card: TrackCard) => {
    // Construct a MegasetTrack from the card data
    const track: MegasetTrack = {
      id: card.id,
      filename: card.filename,
      filepath: card.filepath,
      relative_path: card.relative_path,
      title: card.title,
      artist: card.artist,
      album: card.album,
      album_folder: card.album_folder,
      artist_folder: card.artist_folder,
      filesize: card.filesize,
      year: card.year,
      tracknumber: card.tracknumber,
      genre: card.genre,
      top_5_genres: card.top_5_genres,
      created_at: card.created_at || new Date().toISOString(),
    };
    playTrack(track);
  };

  // 1. Selection View
  if (!selectedPlaylistId) {
    return (
      <PlaylistSelection
        playlists={playlists}
        onSelect={handlePlaylistSelect}
      />
    );
  }

  // 2. Agent View
  return (
    <div className="container py-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={handleBack}>
          ← Back to Playlists
        </Button>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary" />
          Gem Hunter
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <LoadingSpinner />
          <p className="text-lg text-muted-foreground animate-pulse text-center max-w-2xl px-4 whitespace-pre-line">
            {pendingFunFact || loadingMessage}
          </p>
        </div>
      )}

      {/* Agent UI */}
      {!loading && uiState && (
        <AgentView
          uiState={uiState}
          onAction={(option) => handleAction(option, selectedPlaylistId)}
          onPlayTrack={handlePlayTrack}
        />
      )}
    </div>
  );
};

export default GemFinderPage;
