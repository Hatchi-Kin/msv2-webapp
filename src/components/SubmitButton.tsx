import React from 'react';
import { Button } from '@/components/ui/button';
import { MOCHA_THEME, getPrimaryGradient } from '@/constants/theme';
import { useThemeHover } from '@/hooks/useThemeHover';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, loadingText, children }) => {
  const { handleButtonMouseEnter, handleButtonMouseLeave } = useThemeHover();

  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 mt-6"
      style={{
        background: getPrimaryGradient(),
        boxShadow: MOCHA_THEME.shadows.lg,
      }}
      onMouseEnter={(e) => handleButtonMouseEnter(e, loading)}
      onMouseLeave={(e) => handleButtonMouseLeave(e, loading)}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
