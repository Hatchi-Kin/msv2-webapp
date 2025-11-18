import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  ArtistListResponse,
  AlbumListResponse,
  TrackListResponse,
  MegasetTrack,
  SimilarTrack,
  SimilarTrackListResponse,
} from "@/types/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FloatingMusicNotes from "@/components/FloatingMusicNotes";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ArtistsView from "./MusicLibraryPage/views/ArtistsView";
import AlbumsView from "./MusicLibraryPage/views/AlbumsView";
import TracksView from "./MusicLibraryPage/views/TracksView";
import SimilarTracksView from "./MusicLibraryPage/views/SimilarTracksView";

type View = "artists" | "albums" | "tracks" | "similar";

const MusicLibraryPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("artists");
  const [artists, setArtists] = useState<string[]>([]);
  const [totalArtists, setTotalArtists] = useState<number>(0);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [tracks, setTracks] = useState<MegasetTrack[]>([]);

  // Similar tracks state
  const [similarTracks, setSimilarTracks] = useState<SimilarTrack[]>([]);
  const [currentSimilarTrack, setCurrentSimilarTrack] =
    useState<MegasetTrack | null>(null);
  // Track the first track in the recommendation chain (future: "Back to Origin" feature)
  // const [originTrack, setOriginTrack] = useState<MegasetTrack | null>(null);

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset view when logo is clicked
  useEffect(() => {
    if (location.state?.resetView) {
      setCurrentView("artists");
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setAlbums([]);
      setTracks([]);
      setSimilarTracks([]);
      setCurrentSimilarTrack(null);
      // setOriginTrack(null);
      setCurrentPage(1);
      // Clear the state so it doesn't reset again on re-render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 25 : 15);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch Artists (server-side pagination)
  useEffect(() => {
    if (isAuthenticated && accessToken && currentView === "artists") {
      const fetchArtists = async () => {
        try {
          // Only show full page loading on initial load
          if (artists.length === 0 && totalArtists === 0) {
            setPageLoading(true);
          } else {
            setIsLoadingMore(true);
          }
          const offset = (currentPage - 1) * itemsPerPage;
          const response: ArtistListResponse = await api.music.getArtists(
            accessToken,
            itemsPerPage,
            offset
          );
          setArtists(response.artists);
          setTotalArtists(response.total);
        } catch (err) {
          console.error("Failed to fetch artists:", err);
          setPageError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setPageLoading(false);
          setIsLoadingMore(false);
        }
      };
      fetchArtists();
    }
  }, [isAuthenticated, accessToken, currentView, currentPage, itemsPerPage]);

  // Fetch Albums for selected artist
  useEffect(() => {
    if (
      isAuthenticated &&
      accessToken &&
      currentView === "albums" &&
      selectedArtist
    ) {
      const fetchAlbums = async () => {
        try {
          setPageLoading(true);
          const response: AlbumListResponse = await api.music.getAlbumsByArtist(
            selectedArtist,
            accessToken
          );
          setAlbums(response.albums);
        } catch (err) {
          console.error(`Failed to fetch albums for ${selectedArtist}:`, err);
          setPageError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setPageLoading(false);
        }
      };
      fetchAlbums();
    }
  }, [isAuthenticated, accessToken, currentView, selectedArtist]);

  // Fetch Tracks for selected album
  useEffect(() => {
    if (
      isAuthenticated &&
      accessToken &&
      currentView === "tracks" &&
      selectedArtist &&
      selectedAlbum
    ) {
      const fetchTracks = async () => {
        try {
          setPageLoading(true);
          const response: TrackListResponse = await api.music.getTracksByAlbum(
            selectedAlbum,
            accessToken
          );
          setTracks(response.tracks);
        } catch (err) {
          console.error(
            `Failed to fetch tracks for ${selectedAlbum} by ${selectedArtist}:`,
            err
          );
          setPageError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setPageLoading(false);
        }
      };
      fetchTracks();
    }
  }, [
    isAuthenticated,
    accessToken,
    currentView,
    selectedArtist,
    selectedAlbum,
  ]);

  const handleArtistClick = useCallback((artistName: string) => {
    setSelectedArtist(artistName);
    setCurrentView("albums");
    setCurrentPage(1); // Reset to first page when changing view
  }, []);

  const handleAlbumClick = useCallback((albumTitle: string) => {
    setSelectedAlbum(albumTitle);
    setCurrentView("tracks");
  }, []);

  const handleTrackClick = useCallback((track: MegasetTrack) => {
    console.log("Track clicked:", track.title || track.filename);
    // Future: Implement playback or recommendation logic here
  }, []);

  const handleFindSimilar = useCallback(
    async (trackId: number) => {
      if (!accessToken) return;

      try {
        setPageLoading(true);
        setPageError(null);

        // Find the track details
        const track =
          tracks.find((t) => t.id === trackId) ||
          similarTracks.find((st) => st.track.id === trackId)?.track;

        if (!track) {
          console.error("Track not found");
          return;
        }

        // // If this is the first similar tracks request, save as origin
        // if (currentView !== 'similar') {
        //   setOriginTrack(track);
        // }

        setCurrentSimilarTrack(track);

        const response: SimilarTrackListResponse =
          await api.music.getSimilarTracks(trackId, accessToken);
        setSimilarTracks(response.tracks);
        setCurrentView("similar");
      } catch (err) {
        console.error("Failed to fetch similar tracks:", err);
        setPageError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setPageLoading(false);
      }
    },
    [accessToken, tracks, similarTracks, currentView]
  );

  const handleViewArtist = useCallback((artistName: string) => {
    // Clear similar tracks state and navigate to artist's albums
    setSimilarTracks([]);
    setCurrentSimilarTrack(null);
    // setOriginTrack(null);
    setSelectedArtist(artistName);
    setCurrentView("albums");
    setCurrentPage(1);
  }, []);

  const handleBack = useCallback(() => {
    if (currentView === "similar") {
      // Go back to the original tracklist
      setCurrentView("tracks");
      setSimilarTracks([]);
      setCurrentSimilarTrack(null);
      // setOriginTrack(null);
    } else if (currentView === "tracks") {
      setCurrentView("albums");
      setSelectedAlbum(null);
      setTracks([]);
    } else if (currentView === "albums") {
      setCurrentView("artists");
      setSelectedArtist(null);
      setAlbums([]);
    }
    setCurrentPage(1); // Reset to first page when going back
  }, [currentView]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (authLoading || pageLoading) {
    return <LoadingSpinner message="Loading your music..." />;
  }

  if (pageError) {
    return (
      <ErrorMessage
        title={`Error: ${pageError}`}
        message={`Please ensure your backend is running and accessible at ${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
        }`}
      />
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[hsl(30,30%,82%)] to-[hsl(30,23%,70%)]">
      <FloatingMusicNotes />
      <div className="container max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg bg-background">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {currentView === "artists" && "Your Music Library"}
              {currentView === "albums" &&
                selectedArtist &&
                `Albums by ${selectedArtist}`}
              {currentView === "tracks" &&
                selectedAlbum &&
                `Tracks in ${selectedAlbum}`}
              {currentView === "similar" &&
                currentSimilarTrack &&
                "Similar Tracks"}
            </h1>
            {currentView === "albums" && selectedArtist && (
              <p className="text-sm text-foreground opacity-70">
                Browse albums by this artist
              </p>
            )}
            {currentView === "tracks" && selectedAlbum && (
              <p className="text-sm text-foreground opacity-70">
                All tracks in this album
              </p>
            )}
            {currentView === "similar" && currentSimilarTrack && (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-lg bg-muted border border-muted-foreground">
                  <p className="text-sm text-foreground">
                    Similar to:{" "}
                    <span className="font-bold text-primary">
                      {currentSimilarTrack.title ||
                        currentSimilarTrack.filename}
                    </span>
                    {currentSimilarTrack.artist && (
                      <span className="opacity-70">
                        {" "}
                        by {currentSimilarTrack.artist}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentView !== "artists" && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2 border-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md border-border bg-background text-primary"
            >
              <span>← Back</span>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="backdrop-blur-lg rounded-2xl p-6 bg-background border border-border">
          {currentView === "artists" && (
            <ArtistsView
              artists={artists}
              totalArtists={totalArtists}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              isLoadingMore={isLoadingMore}
              onArtistClick={handleArtistClick}
              onPageChange={handlePageChange}
            />
          )}

          {currentView === "albums" && (
            <AlbumsView
              albums={albums}
              selectedArtist={selectedArtist}
              onAlbumClick={handleAlbumClick}
            />
          )}

          {currentView === "tracks" && (
            <TracksView
              tracks={tracks}
              selectedAlbum={selectedAlbum}
              onTrackClick={handleTrackClick}
              onFindSimilar={handleFindSimilar}
            />
          )}

          {currentView === "similar" && (
            <SimilarTracksView
              similarTracks={similarTracks}
              onFindSimilar={handleFindSimilar}
              onViewArtist={handleViewArtist}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicLibraryPage;
