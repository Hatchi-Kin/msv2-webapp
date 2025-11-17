import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Music, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      // Navigate to library with state to reset view
      navigate("/library", { state: { resetView: true } });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(30,30%,82%)] to-[hsl(30,23%,70%)]">
      {isAuthenticated && (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg shadow-md bg-background border-b border-border">
          <div className="container flex h-16 items-center justify-between px-6">
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
            <nav>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-primary bg-transparent hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
