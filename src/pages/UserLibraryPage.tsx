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
import TrackItem from "@/components/TrackItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import LibraryHeader from "@/components/library/LibraryHeader";

type View = "favorites" | "playlists" | "playlist-detail";

const UserLibraryPage: React.FC = () => {
  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    playlists, 
    refreshPlaylists, 
    createPlaylist, 
    deletePlaylist 
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
    if (currentView === "favorites" && accessToken && !hasFetchedFavorites.current) {
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
          <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-600">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="glass-panel rounded-3xl p-6 min-h-[650px]">
          {/* View Tabs - Inside content card */}
          {currentView !== "playlist-detail" && (
            <div className="flex gap-2 rounded-3xl bg-white/30 dark:bg-black/20 border border-white/20 dark:border-white/5 mb-6">
              <button
                onClick={() => setCurrentView("favorites")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${currentView === "favorites"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
              >
                <Heart className="h-5 w-5" />
                Favorites
              </button>
              <button
                onClick={() => setCurrentView("playlists")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${currentView === "playlists"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-transparent text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {favorites.map((track) => (
                    <div
                      key={track.id}
                      className="group cursor-pointer glass-card rounded-3xl hover:border-primary/30"
                      onClick={() => {
                        // Play the track when clicked
                        playQueue([track]);
                      }}
                    >
                      <div className="p-4 space-y-3 flex flex-col min-h-[140px]">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto transition-all duration-300 bg-white/50 dark:bg-white/5">
                          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                        </div>
                        <div className="text-center flex-1 flex flex-col items-center justify-center min-h-[40px]">
                          <p className="font-medium text-sm leading-tight line-clamp-2 text-foreground">
                            {track.title || track.filename}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {track.artist || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                    </div>
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
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
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
                  <TrackItem key={track.id} track={track} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserLibraryPage;
