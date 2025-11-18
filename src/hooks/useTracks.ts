import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/utils/errors";
import type { MegasetTrack } from "@/types/api";

interface UseTracksResult {
  tracks: MegasetTrack[];
  loading: boolean;
  error: string | null;
}

export const useTracks = (albumName: string | undefined): UseTracksResult => {
  const [tracks, setTracks] = useState<MegasetTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !albumName) {
      setLoading(false);
      return;
    }

    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.music.getTracksByAlbum(
          albumName,
          accessToken
        );
        setTracks(response.tracks);
      } catch (err) {
        console.error(`Failed to fetch tracks for ${albumName}:`, err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [isAuthenticated, accessToken, albumName]);

  return {
    tracks,
    loading,
    error,
  };
};
