import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils/errors";
import type { MegasetTrack, PlaylistDetail } from "@/types/api";
import { Heart, ListMusic, Trash2, Plus, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrackItem from "./TrackItem";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LibraryHeader from "./LibraryHeader";
import { cn } from "@/lib/utils";

type View = "favorites" | "playlists" | "playlist-detail";

const LibraryPage: React.FC = () => {
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const {
    playlists,
    refreshPlaylists,
    createPlaylist,
    deletePlaylist,
    removeTrackFromPlaylist,
  } = useLibrary();
  const { playQueue } = usePlayer();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<View>("favorites");
  const [favorites, setFavorites] = useState<MegasetTrack[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PlaylistDetail | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedFavorites = useRef(false);

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
      setLoadingData(true);
      setError(null);
      const response = await api.music.getFavorites(accessToken);
      setFavorites(response.tracks);
      hasFetchedFavorites.current = true;
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoadingData(false);
    }
  }, [accessToken]);

  // Fetch favorites only once
  useEffect(() => {
    if (
      currentView === "favorites" &&
      accessToken &&
      !hasFetchedFavorites.current
    ) {
      fetchFavorites();
    }
  }, [currentView, accessToken, fetchFavorites]);

  const fetchPlaylistDetail = async (playlistId: number) => {
    if (!accessToken) return;

    try {
      setLoadingData(true);
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
      setLoadingData(false);
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

  const handleRemoveTrack = async (trackId: number) => {
    if (!selectedPlaylist) return;
    if (!confirm("Remove this track from the playlist?")) return;

    try {
      await removeTrackFromPlaylist(selectedPlaylist.id, trackId);
      // Update local state to remove the track immediately
      setSelectedPlaylist((prev) =>
        prev
          ? {
              ...prev,
              tracks: prev.tracks.filter((t) => t.id !== trackId),
            }
          : null
      );
    } catch (err) {
      console.error("Failed to remove track:", err);
      setError(getErrorMessage(err));
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Loading your library..." />;
  }

  // Get current title and subtitle
  const getHeaderInfo = () => {
    if (currentView === "favorites") {
      return {
        title: "Your Favorites",
        subtitle: `${favorites.length}/20 favorites`,
      };
    } else if (currentView === "playlists") {
      return {
        title: "Your Playlists",
        subtitle: `${playlists.length} playlists`,
      };
    } else if (currentView === "playlist-detail" && selectedPlaylist) {
      return {
        title: selectedPlaylist.name,
        subtitle: `${selectedPlaylist.tracks.length}/20 tracks`,
      };
    }
    return { title: "", subtitle: "" };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <LibraryHeader
          title={title}
          subtitle={subtitle}
          showBack={currentView === "playlist-detail"}
          onBack={() => {
            setSelectedPlaylist(null);
            setCurrentView("playlists");
          }}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="glass-panel rounded-3xl p-6 min-h-[650px]">
          {/* View Tabs - Inside content card */}
          {currentView !== "playlist-detail" && (
            <div className="flex gap-2 rounded-3xl bg-background/30 dark:bg-background/20 border border-border/20 dark:border-border/5 mb-6">
              <button
                onClick={() => setCurrentView("favorites")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300",
                  currentView === "favorites"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-background/50 dark:hover:bg-background/10"
                )}
              >
                <Heart className="h-5 w-5" />
                Favorites
              </button>
              <button
                onClick={() => setCurrentView("playlists")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300",
                  currentView === "playlists"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-background/50 dark:hover:bg-background/10"
                )}
              >
                <ListMusic className="h-5 w-5" />
                Playlists
              </button>
            </div>
          )}

          {/* Play All Button - Inside content card */}
          {currentView === "favorites" && favorites.length > 0 && (
            <div className="mb-6">
              <Button
                onClick={() => playQueue(favorites)}
                className="flex items-center space-x-2 rounded-xl font-semibold"
              >
                <Play className="h-4 w-4" />
                <span>Play All</span>
              </Button>
            </div>
          )}
          {currentView === "playlist-detail" &&
            selectedPlaylist &&
            selectedPlaylist.tracks.length > 0 && (
              <div className="mb-6">
                <Button
                  onClick={() => playQueue(selectedPlaylist.tracks)}
                  className="flex items-center space-x-2 rounded-xl font-semibold"
                >
                  <Play className="h-4 w-4" />
                  <span>Play All</span>
                </Button>
              </div>
            )}
          {/* Favorites View */}
          {currentView === "favorites" && (
            <div>
              {loadingData && !hasFetchedFavorites.current ? (
                <LoadingSpinner message="Loading favorites..." />
              ) : favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No favorites yet. Start adding tracks!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((track) => (
                    <TrackItem key={track.id} track={track} />
                  ))}
                </div>
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
                  <p className="text-sm text-muted-foreground">
                    No playlists yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="p-4 rounded-3xl glass-card hover:border-primary/30 cursor-pointer group"
                      onClick={() => fetchPlaylistDetail(playlist.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {playlist.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {playlist.track_count}/20 tracks
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlaylist(playlist.id);
                          }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">
                    No tracks in this playlist yet.
                  </p>
                </div>
              ) : (
                selectedPlaylist.tracks.map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    onRemove={() => handleRemoveTrack(track.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LibraryPage;
