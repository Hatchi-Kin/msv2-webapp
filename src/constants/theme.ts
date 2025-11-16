/**
 * Mocha Beats Theme - Coffee-inspired color palette
 */
export const MOCHA_THEME = {
  colors: {
    primary: '#8B5E3C',      // Dark roast coffee
    secondary: '#CE9A6A',    // Caramel latte
    background: '#F6F2EE',   // Cream
    border: '#EDE5DF',       // Soft cream border
    borderHover: '#C2B0A3',  // Darker cream on hover
    text: '#3B2F28',         // Espresso dark
    gradient: {
      start: '#D8C8B8',      // Light mocha
      end: '#C2B0A3',        // Medium mocha
    },
  },
  shadows: {
    sm: '0 2px 8px rgba(139, 94, 60, 0.1)',
    md: '0 8px 25px rgba(139, 94, 60, 0.2)',
    lg: '0 4px 12px rgba(139, 94, 60, 0.3)',
    xl: '0 6px 20px rgba(139, 94, 60, 0.4)',
  },
  opacity: {
    subtle: 0.15,
    light: 0.2,
    medium: 0.5,
    semiTransparent: 0.6,
    visible: 0.7,
  },
} as const;

/**
 * Helper to create gradient background
 */
export const getGradientBackground = () => 
  `linear-gradient(135deg, ${MOCHA_THEME.colors.gradient.start} 0%, ${MOCHA_THEME.colors.gradient.end} 100%)`;

/**
 * Helper to create primary gradient (for text/buttons)
 */
export const getPrimaryGradient = () => 
  `linear-gradient(135deg, ${MOCHA_THEME.colors.primary} 0%, ${MOCHA_THEME.colors.secondary} 100%)`;
