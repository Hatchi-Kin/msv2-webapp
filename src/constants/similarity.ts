/**
 * Similarity score thresholds and badge colors for track recommendations
 */

export const SIMILARITY_THRESHOLDS = {
  EXCELLENT: 97,
  VERY_GOOD: 94,
  GOOD: 91,
} as const;

export const SIMILARITY_BADGE_COLORS = {
  EXCELLENT: {
    bg: "hsl(var(--success))",
    text: "hsl(var(--primary-foreground))",
  },
  VERY_GOOD: { bg: "hsl(var(--info))", text: "hsl(var(--primary-foreground))" },
  GOOD: { bg: "hsl(var(--warning))", text: "hsl(var(--primary-foreground))" },
  DECENT: { bg: "hsl(var(--gray))", text: "hsl(var(--primary-foreground))" },
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
