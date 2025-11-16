import React from 'react';
import { Sparkles } from 'lucide-react';
import FloatingMusicNotes from './FloatingMusicNotes';
import { MOCHA_THEME, getGradientBackground, getPrimaryGradient } from '@/constants/theme';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({
  title,
  subtitle,
  description,
  children,
  footer,
}) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: getGradientBackground() }}
    >
      <FloatingMusicNotes />

      <div
        className="relative z-10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 animate-slideUp max-w-md w-full mx-5 mobile-padding"
        style={{ backgroundColor: MOCHA_THEME.colors.background }}
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-pulse">🎵</div>
          <div
            className="text-4xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{
              background: getPrimaryGradient(),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            MSV2
            <Sparkles className="w-6 h-6" style={{ color: MOCHA_THEME.colors.primary }} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: MOCHA_THEME.colors.text }}>
            {description}
          </p>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 font-bold" style={{ color: MOCHA_THEME.colors.text }}>
            {title}
          </h1>
          <p
            className="text-sm"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}
          >
            {subtitle}
          </p>
        </div>

        {/* Form Content */}
        {children}

        {/* Footer */}
        {footer}

        {/* Bottom Footer */}
        <div
          className="text-center mt-8 pt-6"
          style={{ borderTop: `1px solid ${MOCHA_THEME.colors.border}` }}
        >
          <p
            className="text-xs"
            style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.medium }}
          >
            Powered by modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
