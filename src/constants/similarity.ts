/**
 * Similarity score thresholds and badge colors for track recommendations
 */

export const SIMILARITY_THRESHOLDS = {
  EXCELLENT: 97,
  VERY_GOOD: 94,
  GOOD: 91,
} as const;

export const SIMILARITY_BADGE_COLORS = {
  EXCELLENT: { bg: '#4ade80', text: '#064e3b' }, // Green
  VERY_GOOD: { bg: '#22d3ee', text: '#164e63' }, // Cyan
  GOOD: { bg: '#fbbf24', text: '#78350f' },      // Amber
  DECENT: { bg: '#9ca3af', text: '#1f2937' },    // Gray
} as const;

/**
 * Get badge color based on similarity percentage
 * @param similarityPercent - Similarity percentage (0-100)
 * @returns Badge color object with bg and text colors
 */
export const getSimilarityBadgeColor = (similarityPercent: number) => {
  if (similarityPercent >= SIMILARITY_THRESHOLDS.EXCELLENT) {
    return SIMILARITY_BADGE_COLORS.EXCELLENT;
  }
  if (similarityPercent >= SIMILARITY_THRESHOLDS.VERY_GOOD) {
    return SIMILARITY_BADGE_COLORS.VERY_GOOD;
  }
  if (similarityPercent >= SIMILARITY_THRESHOLDS.GOOD) {
    return SIMILARITY_BADGE_COLORS.GOOD;
  }
  return SIMILARITY_BADGE_COLORS.DECENT;
};
