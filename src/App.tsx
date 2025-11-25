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
import { lazy, Suspense } from "react";
import {
  LandingPage,
  RegisterPage,
  LibraryPage,
  LibraryArtistsPage,
  LibraryAlbumsPage,
  LibraryTracksPage,
  LibrarySimilarPage,
  GemFinderPage,
} from "@/pages";
import LibraryLayout from "@/features/library/LibraryLayout";
import MainLayout from "@/components/layout/MainLayout";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { PlayerProvider } from "@/context/PlayerContext";
import { LibraryProvider } from "@/context/LibraryContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Lazy load VisualizePage to prevent Three.js from loading on every page
const VisualizePage = lazy(() =>
  import("@/features/visualization/VisualizePage").then((module) => ({
    default: module.default,
  }))
);

function App() {
  return (
    // Catch any errors and show a friendly error page
    <ErrorBoundary>
      {/* Provide library data (favorites, playlists) to all components */}
      <LibraryProvider>
        {/* Provide player state (current track, play/pause) to all components */}
        <PlayerProvider>
          {/* Define which component to show for each URL */}
          <Routes>
            {/* Public routes - no layout */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated routes - with layout */}
            <Route element={<MainLayout />}>
              {/* Library Routes */}
              <Route element={<LibraryLayout />}>
                <Route path="/library" element={<LibraryArtistsPage />} />
                <Route path="library/tracks" element={<LibraryTracksPage />} />
                <Route
                  path="visualize"
                  element={
                    <Suspense fallback={<LoadingSpinner message="Loading 3D visualization..." />}>
                      <VisualizePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/library/artists/:artistName"
                  element={<LibraryAlbumsPage />}
                />
                <Route
                  path="/library/albums/:albumName"
                  element={<LibraryTracksPage />}
                />
                <Route
                  path="/library/similar/:trackId"
                  element={<LibrarySimilarPage />}
                />
              </Route>

              <Route path="/my-library" element={<LibraryPage />} />
              <Route path="/gems" element={<GemFinderPage />} />
            </Route>
          </Routes>
        </PlayerProvider>
      </LibraryProvider>
    </ErrorBoundary>
  );
}

export default App;
