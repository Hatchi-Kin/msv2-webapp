import { useCallback } from "react";
import { useLibrary } from "@/context/LibraryContext";

/**
 * Custom hook for toggling track favorites
 *
 * This hook encapsulates all the logic for adding/removing favorites:
 * - Checks if a track is currently favorited
 * - Handles the toggle action (add or remove)
 * - Prevents event bubbling when used in nested elements
 * - Provides proper error handling
 *
 * Usage Example:
 * ```typescript
 * const { isFavorite, toggleFavorite } = useFavoriteToggle(trackId);
 *
 * <button onClick={toggleFavorite}>
 *   {isFavorite ? '❤️ Favorited' : '🤍 Favorite'}
 * </button>
 * ```
 *
 * @param trackId - The ID of the track to toggle
 * @returns Object with isFavorite status and toggleFavorite function
 */
export const useFavoriteToggle = (trackId: number) => {
  // Get library functions from global context
  const { isFavorite, addFavorite, removeFavorite } = useLibrary();

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      // Prevent event from bubbling up (e.g., if button is inside a clickable card)
      e.stopPropagation();

      try {
        // Toggle based on current state
        if (isFavorite(trackId)) {
          await removeFavorite(trackId);
        } else {
          await addFavorite(trackId);
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        throw error; // Re-throw so component can handle it if needed
      }
    },
    [trackId, isFavorite, addFavorite, removeFavorite]
  );

  return {
    isFavorite: isFavorite(trackId),
    toggleFavorite,
  };
};
