import React, { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Sparkles } from "lucide-react";
import { useGemFinderAgent } from "./hooks/useGemFinderAgent";
import { PlaylistSelection } from "./components/PlaylistSelection";
import { AgentView } from "./components/AgentView";

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

  const handlePlayTrack = (card: any) => {
    playTrack({
      id: card.id,
      title: card.title,
      artist: card.artist,
      album: "",
      filename: "",
      filepath: "",
      relative_path: "",
    } as any);
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
