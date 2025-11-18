import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/utils/errors";

interface UseArtistsResult {
  artists: string[];
  totalArtists: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
}

export const useArtists = (initialPage = 1): UseArtistsResult => {
  const [artists, setArtists] = useState<string[]>([]);
  const [totalArtists, setTotalArtists] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { accessToken, isAuthenticated } = useAuth();

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 25 : 15);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await api.music.getArtists(
          accessToken,
          itemsPerPage,
          offset
        );
        setArtists(response.artists);
        setTotalArtists(response.total);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [isAuthenticated, accessToken, currentPage, itemsPerPage]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    artists,
    totalArtists,
    loading,
    error,
    currentPage,
    itemsPerPage,
    setPage,
  };
};
