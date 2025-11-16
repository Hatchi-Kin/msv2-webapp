import React from 'react';
import { MOCHA_THEME, getGradientBackground } from '@/constants/theme';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ background: getGradientBackground() }}
    >
      <div className="p-8 rounded-2xl backdrop-blur-lg" style={{ backgroundColor: MOCHA_THEME.colors.background }}>
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: MOCHA_THEME.colors.primary }}
          ></div>
          <p className="text-xl" style={{ color: MOCHA_THEME.colors.text }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
