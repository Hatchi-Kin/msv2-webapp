import React from 'react';
import { MOCHA_THEME, getGradientBackground } from '@/constants/theme';

interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ background: getGradientBackground() }}
    >
      <div
        className="p-8 rounded-2xl backdrop-blur-lg max-w-md text-center"
        style={{
          backgroundColor: MOCHA_THEME.colors.background,
          border: `1px solid ${MOCHA_THEME.colors.border}`,
        }}
      >
        <p className="text-xl font-bold mb-4" style={{ color: MOCHA_THEME.colors.primary }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: MOCHA_THEME.colors.text, opacity: MOCHA_THEME.opacity.visible }}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;
