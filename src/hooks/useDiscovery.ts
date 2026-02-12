import { useState } from "react";
import { discoveryApi } from "@/lib/api/discovery";
import { ScoredTrack } from "@/types/api";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/context/AuthContext";

export const useDiscovery = () => {
  const [results, setResults] = useState<ScoredTrack[]>([]);
  const [baseVector, setBaseVector] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

  const search = async (query: string) => {
    if (!query.trim() || !accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const data = await discoveryApi.search(query, accessToken);
      setResults(data.results.tracks);
      setBaseVector(data.query_vector);
    } catch (err) {
      console.error("Discovery search failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const refine = async (sliders: {
    digital_organic: number;
    energy: number;
    urban: number;
    bass: number;
  }) => {
    if (!baseVector || !accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const data = await discoveryApi.refine(baseVector, sliders, accessToken);
      setResults(data.results.tracks);
    } catch (err) {
      console.error("Discovery refine failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
    refine,
    hasBaseVector: !!baseVector,
  };
};
