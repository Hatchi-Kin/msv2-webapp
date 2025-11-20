import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Music, LogOut, Heart, Box } from "lucide-react";
import MusicPlayer from "@/components/player/MusicPlayer";

const Layout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      // Navigate to library with state to reset view
      navigate("/library");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(32,30%,92%)] to-[hsl(31,21%,88%)]">
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg shadow-md bg-background border-b border-border">
          <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
            {/* Left: Logo */}
            <a
              href="/library"
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                MSV2
              </span>
            </a>

            {/* Center: Main navigation */}
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                onClick={() => navigate("/library")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-base transition-all duration-300 ${location.pathname.startsWith("/library")
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-white/30 dark:hover:bg-white/10 hover:scale-105"
                  }`}
              >
                <Music className="h-4 w-4" />
                <span>Explore</span>
              </button>
              <button
                onClick={() => navigate("/my-library")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-base transition-all duration-300 ${location.pathname === "/my-library"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-white/30 dark:hover:bg-white/10 hover:scale-105"
                  }`}
              >
                <Heart className="h-4 w-4" />
                <span>Like</span>
              </button>
              <button
                onClick={() => navigate("/visualize")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-base transition-all duration-300 ${location.pathname === "/visualize"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-white/30 dark:hover:bg-white/10 hover:scale-105"
                  }`}
              >
                <Box className="h-4 w-4" />
                <span>Visualize</span>
              </button>
            </nav>

            {/* Right: Logout */}
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-primary bg-transparent hover:bg-white/30 dark:hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </header>
      )}
      <main className="flex-1 pb-24 container mx-auto px-4 max-w-7xl">
        <Outlet />
      </main>
      {isAuthenticated && <MusicPlayer />}
    </div>
  );
};

export default Layout;
