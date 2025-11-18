import { useState, useRef, useCallback } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { UI_CONSTANTS } from "@/constants/ui";

/**
 * Custom hook for managing playlist dropdown menu state
 *
 * Handles opening/closing with mouse hover delay to prevent
 * accidental closes when moving between button and menu.
 *
 * @param trackId - The ID of the track to add to playlist
 * @returns Dropdown state and handlers
 */
export const usePlaylistDropdown = (trackId: number) => {
  const { playlists, addTrackToPlaylist } = useLibrary();
  const [showMenu, setShowMenu] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  /**
   * Delays closing the menu to allow mouse movement
   * between button and dropdown without closing
   */
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowMenu(false);
    }, UI_CONSTANTS.DROPDOWN_CLOSE_DELAY);
  }, []);

  /**
   * Cancels the close timeout when mouse re-enters
   */
  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  }, []);

  const handleAddToPlaylist = useCallback(
    async (playlistId: number) => {
      setIsAdding(true);
      try {
        await addTrackToPlaylist(playlistId, trackId);
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to add to playlist:", error);
      } finally {
        setIsAdding(false);
      }
    },
    [trackId, addTrackToPlaylist]
  );

  return {
    showMenu,
    isAdding,
    playlists,
    toggleMenu,
    handleMouseLeave,
    handleMouseEnter,
    handleAddToPlaylist,
  };
};
