import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { PlaylistSummary } from "@/types/api";

interface LibraryContextType {
  favorites: Set<number>;
  playlists: PlaylistSummary[];
  isLoadingFavorites: boolean;
  isLoadingPlaylists: boolean;
  addFavorite: (trackId: number) => Promise<void>;
  removeFavorite: (trackId: number) => Promise<void>;
  isFavorite: (trackId: number) => boolean;
  refreshFavorites: () => Promise<void>;
  refreshPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<PlaylistSummary>;
  deletePlaylist: (playlistId: number) => Promise<void>;
  addTrackToPlaylist: (playlistId: number, trackId: number) => Promise<void>;
  removeTrackFromPlaylist: (
    playlistId: number,
    trackId: number
  ) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // Fetch favorites on mount and when auth changes
  const refreshFavorites = useCallback(async () => {
    if (!accessToken || !isAuthenticated) return;

    try {
      setIsLoadingFavorites(true);
      const response = await api.music.getFavorites(accessToken);
      const favoriteIds = new Set(response.tracks.map((track) => track.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [accessToken, isAuthenticated]);

  // Fetch playlists on mount and when auth changes
  const refreshPlaylists = useCallback(async () => {
    if (!accessToken || !isAuthenticated) return;

    try {
      setIsLoadingPlaylists(true);
      const response = await api.music.getPlaylists(accessToken);
      setPlaylists(response.playlists);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshFavorites();
      refreshPlaylists();
    } else {
      // Clear data when logged out
      setFavorites(new Set());
      setPlaylists([]);
    }
  }, [isAuthenticated, accessToken, refreshFavorites, refreshPlaylists]);

  const addFavorite = useCallback(
    async (trackId: number) => {
      if (!accessToken) return;

      try {
        await api.music.addFavorite(trackId, accessToken);
        setFavorites((prev) => new Set(prev).add(trackId));
      } catch (error) {
        console.error("Failed to add favorite:", error);
        throw error;
      }
    },
    [accessToken]
  );

  const removeFavorite = useCallback(
    async (trackId: number) => {
      if (!accessToken) return;

      try {
        await api.music.removeFavorite(trackId, accessToken);
        setFavorites((prev) => {
          const newSet = new Set(prev);
          newSet.delete(trackId);
          return newSet;
        });
      } catch (error) {
        console.error("Failed to remove favorite:", error);
        throw error;
      }
    },
    [accessToken]
  );

  const isFavorite = useCallback(
    (trackId: number) => {
      return favorites.has(trackId);
    },
    [favorites]
  );

  const createPlaylist = useCallback(
    async (name: string): Promise<PlaylistSummary> => {
      if (!accessToken) throw new Error("Not authenticated");

      try {
        const newPlaylist = await api.music.createPlaylist(name, accessToken);
        setPlaylists((prev) => [newPlaylist, ...prev]);
        return newPlaylist;
      } catch (error) {
        console.error("Failed to create playlist:", error);
        throw error;
      }
    },
    [accessToken]
  );

  const deletePlaylist = useCallback(
    async (playlistId: number) => {
      if (!accessToken) return;

      try {
        await api.music.deletePlaylist(playlistId, accessToken);
        setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      } catch (error) {
        console.error("Failed to delete playlist:", error);
        throw error;
      }
    },
    [accessToken]
  );

  const addTrackToPlaylist = useCallback(
    async (playlistId: number, trackId: number) => {
      if (!accessToken) return;

      try {
        await api.music.addTrackToPlaylist(playlistId, trackId, accessToken);
        // Refresh playlists to update track count
        await refreshPlaylists();
      } catch (error) {
        console.error("Failed to add track to playlist:", error);
        throw error;
      }
    },
    [accessToken, refreshPlaylists]
  );

  const removeTrackFromPlaylist = useCallback(
    async (playlistId: number, trackId: number) => {
      if (!accessToken) return;

      try {
        await api.music.removeTrackFromPlaylist(
          playlistId,
          trackId,
          accessToken
        );
        // Refresh playlists to update track count
        await refreshPlaylists();
      } catch (error) {
        console.error("Failed to remove track from playlist:", error);
        throw error;
      }
    },
    [accessToken, refreshPlaylists]
  );

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        playlists,
        isLoadingFavorites,
        isLoadingPlaylists,
        addFavorite,
        removeFavorite,
        isFavorite,
        refreshFavorites,
        refreshPlaylists,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
