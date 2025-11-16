import { MOCHA_THEME } from '@/constants/theme';

/**
 * Custom hook for consistent hover effects across the app
 */
export const useThemeHover = () => {
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.style.borderColor = MOCHA_THEME.colors.primary;
    target.style.boxShadow = `0 0 0 3px rgba(139, 94, 60, 0.1)`;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.style.borderColor = MOCHA_THEME.colors.border;
    target.style.boxShadow = 'none';
  };

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.boxShadow = MOCHA_THEME.shadows.md;
    target.style.borderColor = MOCHA_THEME.colors.borderHover;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.boxShadow = MOCHA_THEME.shadows.sm;
    target.style.borderColor = MOCHA_THEME.colors.border;
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, isDisabled = false) => {
    if (isDisabled) return;
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(-2px)';
    target.style.boxShadow = MOCHA_THEME.shadows.xl;
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isDisabled = false) => {
    if (isDisabled) return;
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = MOCHA_THEME.shadows.lg;
  };

  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget as HTMLAnchorElement;
    target.style.color = MOCHA_THEME.colors.secondary;
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget as HTMLAnchorElement;
    target.style.color = MOCHA_THEME.colors.primary;
  };

  return {
    handleInputFocus,
    handleInputBlur,
    handleCardMouseEnter,
    handleCardMouseLeave,
    handleButtonMouseEnter,
    handleButtonMouseLeave,
    handleLinkMouseEnter,
    handleLinkMouseLeave,
  };
};
