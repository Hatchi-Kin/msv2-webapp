import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Music, LogOut } from 'lucide-react';
import { MOCHA_THEME, getGradientBackground, getPrimaryGradient } from '@/constants/theme';

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
      navigate('/library', { state: { resetView: true } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: getGradientBackground() }}>
      {isAuthenticated && (
        <header
          className="sticky top-0 z-50 w-full backdrop-blur-lg shadow-md"
          style={{
            backgroundColor: MOCHA_THEME.colors.background,
            borderBottom: `1px solid ${MOCHA_THEME.colors.border}`,
          }}
        >
          <div className="container flex h-16 items-center justify-between px-6">
            <a
              href="/library"
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Music className="h-6 w-6" style={{ color: MOCHA_THEME.colors.primary }} />
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  background: getPrimaryGradient(),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                MSV2
              </span>
            </a>
            <nav>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  color: MOCHA_THEME.colors.primary,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = MOCHA_THEME.colors.border;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.backgroundColor = 'transparent';
                }}
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
