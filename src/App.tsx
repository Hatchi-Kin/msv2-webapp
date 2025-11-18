/**
 * App Component - Root of the application
 *
 * This is the main entry point that sets up:
 * 1. Error boundary - Catches crashes and shows friendly error page
 * 2. Context providers - Share global state (library, player) across all components
 * 3. Layout - Common header/footer wrapper
 * 4. Routes - Maps URLs to page components
 *
 * Provider Hierarchy (outer to inner):
 * - ErrorBoundary: Catches any errors in child components
 * - LibraryProvider: Manages favorites and playlists
 * - PlayerProvider: Manages music playback state
 * - Layout: Provides header with logo and navigation
 * - Routes: Renders the appropriate page based on URL
 */

import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import UserLibraryPage from "./pages/UserLibraryPage";
import LibraryArtistsPage from "./pages/library/LibraryArtistsPage";
import LibraryAlbumsPage from "./pages/library/LibraryAlbumsPage";
import LibraryTracksPage from "./pages/library/LibraryTracksPage";
import LibrarySimilarPage from "./pages/library/LibrarySimilarPage";
import LibraryLayout from "./components/library/LibraryLayout";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PlayerProvider } from "@/context/PlayerContext";
import { LibraryProvider } from "@/context/LibraryContext";

function App() {
  return (
    // Catch any errors and show a friendly error page
    <ErrorBoundary>
      {/* Provide library data (favorites, playlists) to all components */}
      <LibraryProvider>
        {/* Provide player state (current track, play/pause) to all components */}
        <PlayerProvider>
          {/* Wrap all pages with common layout (header, footer) */}
          <Layout>
            {/* Define which component to show for each URL */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Library Routes */}
              <Route element={<LibraryLayout />}>
                <Route path="/library" element={<LibraryArtistsPage />} />
                <Route path="/library/artists/:artistName" element={<LibraryAlbumsPage />} />
                <Route path="/library/albums/:albumName" element={<LibraryTracksPage />} />
                <Route path="/library/similar/:trackId" element={<LibrarySimilarPage />} />
              </Route>
              
              <Route path="/my-library" element={<UserLibraryPage />} />
            </Routes>
          </Layout>
        </PlayerProvider>
      </LibraryProvider>
    </ErrorBoundary>
  );
}

export default App;
