import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ArtistListResponse, AlbumListResponse, TrackListResponse, MegasetTrack } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ArtistCard from '@/components/ArtistCard';
import AlbumCard from '@/components/AlbumCard';
import TrackItem from '@/components/TrackItem';
import FloatingMusicNotes from '@/components/FloatingMusicNotes';
import { Music } from 'lucide-react';

type View = 'artists' | 'albums' | 'tracks';

const MusicLibraryPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('artists');
  const [artists, setArtists] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [tracks, setTracks] = useState<MegasetTrack[]>([]);

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  const { accessToken, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
          console.log(`Fetching tracks for album: "${selectedAlbum}"`);
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

  const handleBack = useCallback(() => {
    if (currentView === 'tracks') {
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
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: 'linear-gradient(135deg, #D8C8B8 0%, #C2B0A3 100%)' }}>
        <div className="p-8 rounded-2xl backdrop-blur-lg" style={{ backgroundColor: '#F0E9E6' }}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#8B5E3C' }}></div>
            <p className="text-xl" style={{ color: '#3B2F28' }}>Loading your music...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center h-full" style={{ background: 'linear-gradient(135deg, #D8C8B8 0%, #C2B0A3 100%)' }}>
        <div className="p-8 rounded-2xl backdrop-blur-lg max-w-md text-center" style={{ backgroundColor: '#F0E9E6', border: '1px solid #EDE5DF' }}>
          <p className="text-xl font-bold mb-4" style={{ color: '#8B5E3C' }}>Error: {pageError}</p>
          <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.8 }}>
            Please ensure your backend is running and accessible at {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #D8C8B8 0%, #C2B0A3 100%)' }}>
      <FloatingMusicNotes />
      <div className="container max-w-6xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-2xl backdrop-blur-lg" style={{ backgroundColor: '#F0E9E6' }}>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#3B2F28' }}>
              {currentView === 'artists' && 'Your Music Library'}
              {currentView === 'albums' && selectedArtist && `Albums by ${selectedArtist}`}
              {currentView === 'tracks' && selectedAlbum && `Tracks in ${selectedAlbum}`}
            </h1>
            {currentView === 'albums' && selectedArtist && (
              <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>Browse albums by this artist</p>
            )}
            {currentView === 'tracks' && selectedAlbum && (
              <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>All tracks in this album</p>
            )}
          </div>

          {currentView !== 'artists' && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2 border-2 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: '#EDE5DF',
                backgroundColor: '#F0E9E6',
                color: '#8B5E3C'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = '#8B5E3C';
                target.style.boxShadow = '0 4px 12px rgba(139, 94, 60, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.borderColor = '#EDE5DF';
                target.style.boxShadow = 'none';
              }}
            >
              <span>← Back</span>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: '#F0E9E6', border: '1px solid #EDE5DF' }}>
          {currentView === 'artists' && (
            <>
              {artists.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: '#8B5E3C', opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>No artists found in your library.</p>
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
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 gap-4" style={{ borderTop: '1px solid #EDE5DF' }}>
                      <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>
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
                            borderColor: '#EDE5DF',
                            backgroundColor: '#F6F2EE',
                            color: '#8B5E3C',
                            border: '1px solid #EDE5DF'
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
                                  backgroundColor: page === currentPage ? '#8B5E3C' : '#F6F2EE',
                                  color: page === currentPage ? '#F6F2EE' : '#8B5E3C',
                                  border: `1px solid ${page === currentPage ? '#8B5E3C' : '#EDE5DF'}`
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
                            borderColor: '#EDE5DF',
                            backgroundColor: '#F6F2EE',
                            color: '#8B5E3C',
                            border: '1px solid #EDE5DF'
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
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: '#8B5E3C', opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>No albums found for {selectedArtist}.</p>
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
                  <Music className="h-12 w-12 mx-auto mb-4" style={{ color: '#8B5E3C', opacity: 0.5 }} />
                  <p className="text-sm" style={{ color: '#3B2F28', opacity: 0.7 }}>No tracks found for {selectedAlbum}.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {tracks.map((track) => (
                    <TrackItem key={track.id} track={track} onClick={handleTrackClick} />
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
