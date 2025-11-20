import React from "react";
import { ListPlus } from "lucide-react";
import { usePlaylistDropdown } from "@/hooks/usePlaylistDropdown";
import { UI_CONSTANTS } from "@/constants/ui";

interface PlaylistDropdownProps {
  trackId: number;
  /** Optional: "button" for icon button, "full" for full-width button */
  variant?: "button" | "full";
}

/**
 * Reusable playlist dropdown component
 * 
 * Displays a button that opens a dropdown menu to add a track
 * to one of the user's playlists.
 */
export const PlaylistDropdown: React.FC<PlaylistDropdownProps> = ({
  trackId,
  variant = "button",
}) => {
  const {
    showMenu,
    isAdding,
    playlists,
    toggleMenu,
    handleMouseLeave,
    handleMouseEnter,
    handleAddToPlaylist,
  } = usePlaylistDropdown(trackId);

  const buttonClasses =
    variant === "button"
      ? "p-2 rounded-lg transition-all duration-300 bg-transparent text-primary opacity-50 hover:bg-primary/10 hover:scale-110 hover:opacity-100"
      : "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50";

  return (
    <div
      className={variant === "button" ? "relative" : "flex-1 relative"}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <button
        onClick={toggleMenu}
        disabled={isAdding}
        className={buttonClasses}
        title="Add to playlist"
      >
        <ListPlus className={variant === "button" ? "h-5 w-5" : "w-3 h-3"} />
        {variant === "full" && "Playlist"}
      </button>

      {/* Playlist dropdown menu */}
      {showMenu && (
        <div
          className="absolute left-0 bottom-full mb-2 bg-background border-2 border-primary rounded-xl shadow-2xl z-[100] min-w-[240px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="p-3 overflow-y-auto"
            style={{ maxHeight: `${UI_CONSTANTS.MAX_DROPDOWN_HEIGHT}px` }}
          >
            {playlists.length === 0 ? (
              <div className="px-4 py-3 text-base text-foreground font-medium">
                No playlists yet
              </div>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToPlaylist(playlist.id);
                  }}
                  disabled={isAdding || playlist.track_count >= 20}
                  className="w-full text-left px-4 py-3 text-base rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1 last:mb-0"
                >
                  <div className="font-semibold">{playlist.name}</div>
                  <div className="text-sm opacity-80 font-medium">
                    {playlist.track_count}/20 tracks
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
