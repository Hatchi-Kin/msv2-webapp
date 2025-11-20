import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Music, LogOut, Heart, Box } from "lucide-react";
import MusicPlayer from "@/features/player/MusicPlayer";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col bg-mocha-gradient">
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg shadow-md bg-background border-b border-border">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto gap-4">
            {/* Left: Logo */}
            <a
              href="/library"
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0"
            >
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent hidden sm:inline-block">
                MSV2
              </span>
            </a>

            {/* Center: Main navigation */}
            <nav className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => navigate("/library")}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold text-sm md:text-base transition-all duration-300",
                  location.pathname.startsWith("/library")
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-accent hover:scale-105"
                )}
                title="Explore"
              >
                <Music className="h-4 w-4" />
                <span className="hidden md:inline">Explore</span>
              </button>
              <button
                onClick={() => navigate("/my-library")}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold text-sm md:text-base transition-all duration-300",
                  location.pathname === "/my-library"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-accent hover:scale-105"
                )}
                title="Like"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden md:inline">Like</span>
              </button>
              <button
                onClick={() => navigate("/visualize")}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold text-sm md:text-base transition-all duration-300",
                  location.pathname === "/visualize"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-primary hover:bg-accent hover:scale-105"
                )}
                title="Visualize"
              >
                <Box className="h-4 w-4" />
                <span className="hidden md:inline">Visualize</span>
              </button>
            </nav>

            {/* Right: Logout */}
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-primary bg-transparent hover:bg-accent flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
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
