import React from "react";
import { Heart } from "lucide-react";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  trackId: number;
  /** Optional: "icon" for icon-only, "full" for button with text */
  variant?: "icon" | "full";
}

/**
 * Reusable favorite toggle button
 *
 * Displays a heart icon that toggles between filled (favorited)
 * and outline (not favorited) states.
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  trackId,
  variant = "icon",
}) => {
  const { isFavorite, toggleFavorite } = useFavoriteToggle(trackId);

  if (variant === "icon") {
    return (
      <button
        onClick={toggleFavorite}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isFavorite
            ? "bg-primary/20 text-primary opacity-100"
            : "bg-transparent text-primary opacity-50 hover:bg-primary/10"
        } hover:scale-110 hover:opacity-100`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
      </button>
    );
  }

  // Full button variant (for cards)
  return (
    <button
      onClick={toggleFavorite}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
        isFavorite
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-primary border border-muted-foreground hover:bg-primary hover:text-primary-foreground"
      } hover:-translate-y-0.5 hover:shadow-md`}
    >
      <Heart className={cn("w-3 h-3", isFavorite && "fill-current")} />
      {isFavorite ? "Favorited" : "Favorite"}
    </button>
  );
};
