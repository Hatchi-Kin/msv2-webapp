import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/utils/errors";

interface UseAlbumsResult {
  albums: string[];
  loading: boolean;
  error: string | null;
}

export const useAlbums = (artistName: string | undefined): UseAlbumsResult => {
  const [albums, setAlbums] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !artistName) {
      setLoading(false);
      return;
    }

    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.music.getAlbumsByArtist(
          artistName,
          accessToken
        );
        setAlbums(response.albums);
      } catch (err) {
        console.error(`Failed to fetch albums for ${artistName}:`, err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [isAuthenticated, accessToken, artistName]);

  return {
    albums,
    loading,
    error,
  };
};
