import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils/errors";
import type { MegasetTrack, PlaylistDetail } from "@/types/api";
import { Heart, ListMusic, Trash2, Plus, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrackItem from "@/components/TrackItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import FloatingMusicNotes from "@/components/FloatingMusicNotes";

type View = "favorites" | "playlists" | "playlist-detail";

const UserLibraryPage: React.FC = () => {
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const { playlists, refreshPlaylists, createPlaylist, deletePlaylist } =
    useLibrary();
  const { playQueue } = usePlayer();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<View>("favorites");
  const [favorites, setFavorites] = useState<MegasetTrack[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New playlist creation
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchFavorites = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.music.getFavorites(accessToken);
      setFavorites(response.tracks);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Fetch favorites when view changes
  useEffect(() => {
    if (currentView === "favorites" && accessToken) {
      fetchFavorites();
    }
  }, [currentView, accessToken, fetchFavorites]);

  const fetchPlaylistDetail = async (playlistId: number) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const response = await api.music.getPlaylistDetail(
        playlistId,
        accessToken
      );
      setSelectedPlaylist(response);
      setCurrentView("playlist-detail");
    } catch (err) {
      console.error("Failed to fetch playlist:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      setIsCreating(true);
      await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setShowCreatePlaylist(false);
      await refreshPlaylists();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await deletePlaylist(playlistId);
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null);
        setCurrentView("playlists");
      }
      await refreshPlaylists();
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      setError(getErrorMessage(err));
    }
  };

  const handleBack = () => {
    if (currentView === "playlist-detail") {
      setCurrentView("playlists");
      setSelectedPlaylist(null);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner message="Loading your library..." />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[hsl(30,30%,82%)] to-[hsl(30,23%,70%)]">
      <FloatingMusicNotes />
      <div className="container max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg bg-background">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {currentView === "favorites" && "Your Favorites"}
              {currentView === "playlists" && "Your Playlists"}
              {currentView === "playlist-detail" && selectedPlaylist?.name}
            </h1>
            <p className="text-sm text-foreground opacity-70">
              {currentView === "favorites" &&
                `${favorites.length}/20 favorites`}
              {currentView === "playlists" && `${playlists.length} playlists`}
              {currentView === "playlist-detail" &&
                selectedPlaylist &&
                `${selectedPlaylist.tracks.length}/20 tracks`}
            </p>
          </div>

          <div className="flex gap-2">
            {currentView === "favorites" && favorites.length > 0 && (
              <Button
                onClick={() => playQueue(favorites)}
                className="flex items-center space-x-2 rounded-xl font-semibold"
              >
                <Play className="h-4 w-4" />
                <span>Play All</span>
              </Button>
            )}
            {currentView === "playlist-detail" &&
              selectedPlaylist &&
              selectedPlaylist.tracks.length > 0 && (
                <Button
                  onClick={() => playQueue(selectedPlaylist.tracks)}
                  className="flex items-center space-x-2 rounded-xl font-semibold"
                >
                  <Play className="h-4 w-4" />
                  <span>Play All</span>
                </Button>
              )}
            {currentView === "playlist-detail" && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex items-center space-x-2 border-2 rounded-xl font-semibold"
              >
                <span>← Back</span>
              </Button>
            )}
          </div>
        </div>

        {/* View Tabs */}
        {currentView !== "playlist-detail" && (
          <div className="flex gap-2 p-2 rounded-2xl backdrop-blur-lg bg-background">
            <button
              onClick={() => setCurrentView("favorites")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                currentView === "favorites"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              <Heart className="h-5 w-5" />
              Favorites
            </button>
            <button
              onClick={() => setCurrentView("playlists")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                currentView === "playlists"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              <ListMusic className="h-5 w-5" />
              Playlists
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
          {/* Favorites View */}
          {currentView === "favorites" && (
            <div className="space-y-2">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-sm text-foreground opacity-70">
                    No favorites yet. Start adding tracks!
                  </p>
                </div>
              ) : (
                favorites.map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))
              )}
            </div>
          )}

          {/* Playlists View */}
          {currentView === "playlists" && (
            <div className="space-y-4">
              {/* Create Playlist Button */}
              <div className="flex justify-end">
                {!showCreatePlaylist ? (
                  <Button
                    onClick={() => setShowCreatePlaylist(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Playlist
                  </Button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleCreatePlaylist()
                      }
                      placeholder="Playlist name..."
                      className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                      autoFocus
                      maxLength={50}
                    />
                    <Button
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistName.trim() || isCreating}
                      size="sm"
                    >
                      Create
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCreatePlaylist(false);
                        setNewPlaylistName("");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Playlists List */}
              {playlists.length === 0 ? (
                <div className="text-center py-12">
                  <ListMusic className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-sm text-foreground opacity-70">
                    No playlists yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="p-4 rounded-xl border border-border bg-muted hover:border-primary transition-all cursor-pointer group"
                      onClick={() => fetchPlaylistDetail(playlist.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {playlist.name}
                          </h3>
                          <p className="text-sm text-foreground opacity-60">
                            {playlist.track_count}/20 tracks
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlaylist(playlist.id);
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-foreground opacity-50">
                        Updated{" "}
                        {new Date(playlist.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Playlist Detail View */}
          {currentView === "playlist-detail" && selectedPlaylist && (
            <div className="space-y-2">
              {selectedPlaylist.tracks.length === 0 ? (
                <div className="text-center py-12">
                  <ListMusic className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-sm text-foreground opacity-70">
                    No tracks in this playlist yet.
                  </p>
                </div>
              ) : (
                selectedPlaylist.tracks.map((track) => (
                  <TrackItem key={track.id} track={track} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLibraryPage;
