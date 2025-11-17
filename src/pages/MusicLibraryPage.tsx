import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ArtistListResponse, AlbumListResponse, TrackListResponse, MegasetTrack, SimilarTrack, SimilarTrackListResponse } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ArtistCard from '@/components/ArtistCard';
import AlbumCard from '@/components/AlbumCard';
import TrackItem from '@/components/TrackItem';
import SimilarTrackCard from '@/components/SimilarTrackCard';
import FloatingMusicNotes from '@/components/FloatingMusicNotes';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Music } from 'lucide-react';
import { MOCHA_THEME, getGradientBackground } from '@/constants/theme';

type View = 'artists' | 'albums' | 'tracks' | 'similar';

const MusicLibraryPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('artists');
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [tracks, setTracks] = useState<MegasetTrack[]>([]);

  // Similar tracks state
  const [similarTracks, setSimilarTracks] = useState<SimilarTrack[]>([]);
  const [currentSimilarTrack, setCurrentSimilarTrack] = useState<MegasetTrack | null>(null);
  // Track the first track in the recommendation chain (future: "Back to Origin" feature)
  // const [originTrack, setOriginTrack] = useState<MegasetTrack | null>(null);

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Reset view when logo is clicked
  useEffect(() => {
    if (location.state?.resetView) {
      setCurrentView('artists');
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch Artists
  useEffect(() => {
    if (isAuthenticated && accessToken && currentView === 'artists') {
      const fetchArtists = async () => {
        try {
          setPageLoading(true);
          const response: ArtistListResponse = await api.music.getArtists(accessToken);
          setArtists(response.artists);
        } catch (err) {
          console.error('Failed to fetch artists:', err);
          setPageError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setPageLoading(false);
        }
      };
      fetchArtists();
    }
  }, [isAuthenticated, accessToken, currentView]);

  // Fetch Albums for selected artist
  useEffect(() => {
    if (isAuthenticated && accessToken && currentView === 'albums' && selectedArtist) {
      const fetchAlbums = async () => {
        try {
          setPageLoading(true);
          const response: AlbumListResponse = await api.music.getAlbumsByArtist(selectedArtist, accessToken);
          setAlbums(response.albums);
        } catch (err) {
          console.error(`Failed to fetch albums for ${selectedArtist}:`, err);
          setPageError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setPageLoading(false);
        }
      };
      fetchAlbums();
    }
  }, [isAuthenticated, accessToken, currentView, selectedArtist]);

  // Fetch Tracks for selected album
  useEffect(() => {
    if (isAuthenticated && accessToken && currentView === 'tracks' && selectedArtist && selectedAlbum) {
      const fetchTracks = async () => {
        try {
          setPageLoading(true);
          const response: TrackListResponse = await api.music.getTracksByAlbum(
            selectedAlbum,
            accessToken
          );
          setTracks(response.tracks);
        } catch (err) {
          console.error(`Failed to fetch tracks for ${selectedAlbum} by ${selectedArtist}:`, err);
          setPageError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setPageLoading(false);
        }
      };
      fetchTracks();
    }
  }, [isAuthenticated, accessToken, currentView, selectedArtist, selectedAlbum]);

  const handleArtistClick = useCallback((artistName: string) => {
    setSelectedArtist(artistName);
    setCurrentView('albums');
    setCurrentPage(1); // Reset to first page when changing view
  }, []);

  const handleAlbumClick = useCallback((albumTitle: string) => {
    setSelectedAlbum(albumTitle);
    setCurrentView('tracks');
  }, []);

  const handleTrackClick = useCallback((track: MegasetTrack) => {
    console.log('Track clicked:', track.title || track.filename);
    // Future: Implement playback or recommendation logic here
  }, []);

  const handleFindSimilar = useCallback(async (trackId: number) => {
    if (!accessToken) return;

    try {
      setPageLoading(true);
      setPageError(null);

      // Find the track details
      const track = tracks.find(t => t.id === trackId) ||
        similarTracks.find(st => st.track.id === trackId)?.track;

      if (!track) {
        console.error('Track not found');
        return;
      }

      // // If this is the first similar tracks request, save as origin
      // if (currentView !== 'similar') {
      //   setOriginTrack(track);
      // }

      setCurrentSimilarTrack(track);

      const response: SimilarTrackListResponse = await api.music.getSimilarTracks(trackId, accessToken);
      setSimilarTracks(response.tracks);
      setCurrentView('similar');
    } catch (err) {
      console.error('Failed to fetch similar tracks:', err);
      setPageError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setPageLoading(false);
    }
  }, [accessToken, tracks, similarTracks, currentView]);

  const handleViewArtist = useCallback((artistName: string) => {
    // Clear similar tracks state and navigate to artist's albums
    setSimilarTracks([]);
    setCurrentSimilarTrack(null);
    // setOriginTrack(null);
    setSelectedArtist(artistName);
    setCurrentView('albums');
    setCurrentPage(1);
  }, []);

  const handleBack = useCallback(() => {
    if (currentView === 'similar') {
      // Go back to the original tracklist
      setCurrentView('tracks');
      setSimilarTracks([]);
      setCurrentSimilarTrack(null);
      // setOriginTrack(null);
    } else if (currentView === 'tracks') {
      setCurrentView('albums');
      setSelectedAlbum(null);
      setTracks([]);
    } else if (currentView === 'albums') {
      setCurrentView('artists');
      setSelectedArtist(null);
      setAlbums([]);
    }
    setCurrentPage(1); // Reset to first page when going back
  }, [currentView]);

  // Calculate pagination for artists
  const totalPages = Math.ceil(artists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtists = artists.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || pageLoading) {
    return <LoadingSpinner message="Loading your music..." />;
  }

  if (pageError) {
    return (
      <ErrorMessage
        title={`Error: ${pageError}`}
        message={`Please ensure your backend is running and accessible at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}`}
      />
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: getGradientBackground() }}>
      <FloatingMusicNotes />
      <div className="container max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg" style={{ backgroundColor: MOCHA_THEME.colors.background }}>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: MOCHA_THEME.colors.text }}>
              {currentView === 'artists' && 'Your Music Library'}
              {currentView === 'albums' && selectedArtist && `Albums by ${selectedArtist}`}
              {currentView === 'tracks' && selectedAlbum && `Tracks in ${selectedAlbum}`}
              {currentView === 'similar' && currentSimilarTrack && 'Similar Tracks'}
            </h1>
            {currentView === 'albums' && selectedArtist && (
              <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>Browse albums by this artist</p>
            )}
            {currentView === 'tracks' && selectedAlbum && (
              <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>All tracks in this album</p>
            )}
            {currentView === 'similar' && currentSimilarTrack && (
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1 rounded-lg"
                  style={{
                    backgroundColor: MOCHA_THEME.colors.border,
                    border: `1px solid ${MOCHA_THEME.colors.borderHover}`
                  }}
                >
                  <p className="text-sm" style={{ color: MOCHA_THEME.colors.text }}>
                    Similar to: <span className="font-bold" style={{ color: MOCHA_THEME.colors.primary }}>
                      {currentSimilarTrack.title || currentSimilarTrack.filename}
                    </span>
                    {currentSimilarTrack.artist && (
                      <span style={{ opacity: MOCHA_THEME.opacity.visible }}> by {currentSimilarTrack.artist}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentView !== 'artists' && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2 border-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: MOCHA_THEME.colors.border,
                backgroundColor: MOCHA_THEME.colors.background,
                color: MOCHA_THEME.colors.primary
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = MOCHA_THEME.colors.primary;
                target.style.boxShadow = MOCHA_THEME.shadows.md;
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = MOCHA_THEME.colors.border;
                target.style.boxShadow = 'none';
              }}
            >
              <span>← Back</span>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: MOCHA_THEME.colors.background, border: `1px solid ${MOCHA_THEME.colors.border}` }}>
          {currentView === 'artists' && (
            <>
              {artists.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: MOCHA_THEME.colors.primary, opacity: MOCHA_THEME.opacity.medium }} />
                  <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>No artists found in your library.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {paginatedArtists.map((artistName) => (
                      <ArtistCard key={artistName} artistName={artistName} onClick={handleArtistClick} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 gap-4" style={{ borderTop: `1px solid ${MOCHA_THEME.colors.border}` }}>
                      <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>
                        Showing {startIndex + 1}-{Math.min(endIndex, artists.length)} of {artists.length} artists
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            borderColor: MOCHA_THEME.colors.border,
                            backgroundColor: MOCHA_THEME.colors.background,
                            color: MOCHA_THEME.colors.primary,
                            border: `1px solid ${MOCHA_THEME.colors.border}`
                          }}
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 7) {
                              page = i + 1;
                            } else if (currentPage <= 4) {
                              page = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                              page = totalPages - 6 + i;
                            } else {
                              page = currentPage - 3 + i;
                            }

                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className="w-10 h-10 rounded-xl font-semibold transition-all duration-300 text-sm"
                                style={{
                                  backgroundColor: page === currentPage ? MOCHA_THEME.colors.primary : MOCHA_THEME.colors.background,
                                  color: page === currentPage ? MOCHA_THEME.colors.background : MOCHA_THEME.colors.primary,
                                  border: `1px solid ${page === currentPage ? MOCHA_THEME.colors.primary : MOCHA_THEME.colors.border}`
                                }}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>

                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            borderColor: MOCHA_THEME.colors.border,
                            backgroundColor: MOCHA_THEME.colors.background,
                            color: MOCHA_THEME.colors.primary,
                            border: `1px solid ${MOCHA_THEME.colors.border}`
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {currentView === 'albums' && (
            <>
              {albums.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: MOCHA_THEME.colors.primary, opacity: MOCHA_THEME.opacity.medium }} />
                  <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>No albums found for {selectedArtist}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {albums.map((albumTitle) => (
                    <AlbumCard key={albumTitle} albumTitle={albumTitle} onClick={handleAlbumClick} />
                  ))}
                </div>
              )}
            </>
          )}

          {currentView === 'tracks' && (
            <>
              {tracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: MOCHA_THEME.colors.primary, opacity: MOCHA_THEME.opacity.medium }} />
                  <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>No tracks found for {selectedAlbum}.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {tracks.map((track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      onClick={handleTrackClick}
                      onFindSimilar={handleFindSimilar}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {currentView === 'similar' && (
            <>
              {similarTracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: MOCHA_THEME.colors.primary, opacity: MOCHA_THEME.opacity.medium }} />
                  <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>No similar tracks found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {similarTracks.map((similarTrack, index) => (
                    <div
                      key={similarTrack.track.id}
                      style={{
                        animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <SimilarTrackCard
                        similarTrack={similarTrack}
                        onPlay={() => {
                          const track = similarTrack.track;
                          console.log('Playing track:', track.title || track.filename);
                        }}
                        onFindSimilar={handleFindSimilar}
                        onViewArtist={handleViewArtist}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicLibraryPage;
