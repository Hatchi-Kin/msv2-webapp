import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { UIState, ButtonOption, TrackCard } from "@/lib/api/agent";
import { FavoriteButton } from "@/features/library/FavoriteButton";
import { PlaylistDropdown } from "@/features/library/PlaylistDropdown";
import { AgentMessage } from "./AgentMessage";

interface AgentViewProps {
  uiState: UIState;
  onAction: (option: ButtonOption) => void;
  onPlayTrack: (card: TrackCard) => void;
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
        uiState.message.includes("Which of these artists") && (
          <div className="space-y-4">
            <div className="space-y-2">
              {uiState.options
                .filter((opt) => opt.value !== "none" && opt.value !== "all")
                .map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-card/40 hover:bg-card/60 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedArtists.includes(option.value)}
                      onChange={(e) => {
                        const checkbox = e.target;
                        if (checkbox.checked) {
                          setSelectedArtists((prev) => [...prev, option.value]);
                        } else {
                          setSelectedArtists((prev) =>
                            prev.filter((a) => a !== option.value)
                          );
                        }
                      }}
                      className="w-5 h-5 rounded border-white/20 bg-background/50 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-base">{option.label}</span>
                  </label>
                ))}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() =>
                  onAction({
                    label: "Submit",
                    value: "submit",
                    action: "submit_knowledge",
                    payload: { known_artists: selectedArtists },
                  })
                }
                className="flex-1 h-12 px-6 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all"
              >
                Submit Selection
              </Button>
              <Button
                onClick={() =>
                  onAction({
                    label: "None",
                    value: "none",
                    action: "submit_knowledge",
                    payload: { known_artists: [] },
                  })
                }
                variant="outline"
                className="h-12 px-6 text-lg rounded-full"
              >
                None of them
              </Button>
            </div>
          </div>
        )}

      {/* Cards Grid */}
      {uiState.cards.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {uiState.cards.map((card) => (
            <Card
              key={card.id}
              className="group p-4 glass-card border-0 hover:scale-[1.02] hover:z-10 transition-all duration-300 relative"
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
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {card.reason}
                  </p>

                  {/* Metrics & Confidence */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Confidence Badge */}
                    {card.confidence !== undefined &&
                      card.confidence !== null && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            card.confidence > 0.8
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : card.confidence > 0.6
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          ★ {Math.round(card.confidence * 100)}% Match
                        </span>
                      )}

                    {/* Energy */}
                    {card.energy !== undefined && card.energy !== null && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        ⚡ Energy: {card.energy.toFixed(2)}
                      </span>
                    )}

                    {/* Mood */}
                    {card.valence !== undefined && card.valence !== null && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                        😊 Mood: {card.valence.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Explanations */}
                  {card.explanations && card.explanations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {card.explanations.slice(0, 2).map((exp, i) => (
                        <p
                          key={i}
                          className="text-[10px] text-muted-foreground flex items-center gap-1"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary/50" />
                          {exp}
                        </p>
                      ))}
                    </div>
                  )}
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Interaction Buttons (for vibe selection) */}
      {uiState.options.length > 0 &&
        !uiState.message.includes("Which of these artists") &&
        uiState.cards.length === 0 && (
          <div className="flex flex-wrap gap-3 pt-4">
            {uiState.options.map((option) => (
              <Button
                key={option.value}
                onClick={() =>
                  onAction({
                    label: option.label,
                    value: option.value,
                    action: "set_vibe",
                    payload: { vibe: option.value },
                  })
                }
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
