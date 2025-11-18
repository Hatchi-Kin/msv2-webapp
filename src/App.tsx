import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import MusicLibraryPage from "./pages/MusicLibraryPage";
import UserLibraryPage from "./pages/UserLibraryPage";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PlayerProvider } from "@/context/PlayerContext";
import { LibraryProvider } from "@/context/LibraryContext";

function App() {
  return (
    <ErrorBoundary>
      <LibraryProvider>
        <PlayerProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/library" element={<MusicLibraryPage />} />
              <Route path="/my-library" element={<UserLibraryPage />} />
            </Routes>
          </Layout>
        </PlayerProvider>
      </LibraryProvider>
    </ErrorBoundary>
  );
}

export default App;
