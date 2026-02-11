import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/utils/errors";
import type { ScoredTrack, MegasetTrack } from "@/types/api";

interface UseSimilarTracksResult {
  scoredTracks: ScoredTrack[];
  originTrack: MegasetTrack | null;
  loading: boolean;
  error: string | null;
}

export const useSimilarTracks = (
  trackId: number | undefined
): UseSimilarTracksResult => {
  const [scoredTracks, setScoredTracks] = useState<ScoredTrack[]>([]);
  const [originTrack, setOriginTrack] = useState<MegasetTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !trackId) {
      setLoading(false);
      return;
    }

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get the track details for the origin track
        // We try to fetch it directly since we might have navigated here directly
        const track = await api.music.getSongById(trackId, accessToken);
        setOriginTrack(track);

        // Then fetch similar tracks
        const response = await api.music.getSimilarTracks(trackId, accessToken);
        setScoredTracks(response.tracks);
      } catch (err) {
        console.error("Failed to fetch similar tracks:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [isAuthenticated, accessToken, trackId]);

  return {
    scoredTracks,
    originTrack,
    loading,
    error,
  };
};
