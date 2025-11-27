import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { UIState, ButtonOption } from "@/lib/api/agent";
import { FavoriteButton } from "@/features/library/FavoriteButton";
import { PlaylistDropdown } from "@/features/library/PlaylistDropdown";
import { AgentMessage } from "./AgentMessage";

interface AgentViewProps {
  uiState: UIState;
  onAction: (option: ButtonOption) => void;
  onPlayTrack: (card: any) => void;
}

export const AgentView: React.FC<AgentViewProps> = ({
  uiState,
  onAction,
  onPlayTrack,
}) => {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Message Bubble */}
      <AgentMessage 
        message={uiState.message} 
        understanding={uiState.understanding}
        selection={uiState.selection}
      />

      {/* Artist Knowledge Check - Multi-select */}
      {uiState.options.length > 0 &&
        uiState.options[0].action === "submit_knowledge" && (
          <div className="space-y-4">
            <div className="space-y-2">
              {uiState.options[0].payload.artists.map((artist: string) => (
                <label
                  key={artist}
                  className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-card/40 hover:bg-card/60 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={artist}
                    onChange={(e) => {
                      const checkbox = e.target;
                      if (checkbox.checked) {
                        setSelectedArtists((prev) => [...prev, artist]);
                      } else {
                        setSelectedArtists((prev) =>
                          prev.filter((a) => a !== artist)
                        );
                      }
                    }}
                    className="w-5 h-5 rounded border-white/20 bg-background/50 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-base">{artist}</span>
                </label>
              ))}
            </div>
            <Button
              onClick={() =>
                onAction({
                  ...uiState.options[0],
                  payload: { known_artists: selectedArtists },
                })
              }
              className="h-12 px-6 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all"
            >
              {uiState.options[0].label}
            </Button>
          </div>
        )}

      {/* Cards Grid */}
      {uiState.cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {uiState.cards.map((card) => {
            const addOption = uiState.options.find(
              (opt) => opt.payload.track_id === card.id
            );
            return (
              <Card
                key={card.id}
                className="p-4 glass-card border-0 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Cover Placeholder - Matches SimilarTrackCard style */}
                  <div className="relative w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <div className="text-2xl font-bold text-primary opacity-40">
                      🎵
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">
                      {card.title || card.filename}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {card.artist || "Unknown Artist"}
                    </p>
                    <p className="text-xs text-primary mt-1 italic">
                      "{card.reason}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Play Button - Uses full track object */}
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(card);
                      }}
                      className="h-10 w-10 hover:scale-110 hover:shadow-md"
                      title="Play"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </Button>

                    {/* Favorite Button */}
                    <FavoriteButton trackId={card.id} variant="icon" />

                    {/* Playlist Dropdown */}
                    <PlaylistDropdown trackId={card.id} variant="button" />

                    {/* Add Button */}
                    {addOption && (
                      <Button
                        onClick={() => onAction(addOption)}
                        className="flex-shrink-0"
                        variant="secondary"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interaction Buttons (for vibe selection and other non-add actions) */}
      {uiState.options.length > 0 &&
        uiState.options[0].action !== "submit_knowledge" &&
        uiState.options[0].action !== "add" && (
          <div className="flex flex-wrap gap-3 pt-4">
            {uiState.options.map((option) => (
              <Button
                key={option.id}
                onClick={() => onAction(option)}
                className="h-12 px-6 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all"
                variant="secondary"
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
    </div>
  );
};
