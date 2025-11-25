import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles } from "lucide-react";
import { PlaylistSummary } from "@/types/api";

interface PlaylistSelectionProps {
  playlists: PlaylistSummary[];
  onSelect: (playlistId: number) => void;
}

export const PlaylistSelection: React.FC<PlaylistSelectionProps> = ({
  playlists,
  onSelect,
}) => {
  const hasPlaylists = playlists.length > 0;

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-br from-primary to-secondary-foreground bg-clip-text text-transparent">
          Hidden Gem Hunter
        </h1>
        <p className="text-muted-foreground text-lg">
          {hasPlaylists
            ? "Select a playlist to find similar tracks you've never heard before."
            : "To start, you need a playlist with at least 3 songs."}
        </p>
      </div>

      {!hasPlaylists ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-card/30">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Playlists Found</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            The Agent needs a playlist to understand your taste. Go create one
            and add some tracks!
          </p>
          <Button onClick={() => (window.location.href = "/my-library")}>
            Go to Library
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((p) => (
            <Card
              key={p.id}
              className={`p-6 transition-all bg-card/50 backdrop-blur border-white/10 group relative overflow-hidden ${
                p.track_count < 3
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 cursor-pointer hover:border-primary/50"
              }`}
              onClick={() => {
                if (p.track_count >= 3) {
                  onSelect(p.id);
                }
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                {p.track_count >= 3 && (
                  <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 relative z-10">
                {p.track_count} tracks
              </p>
              {p.track_count < 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                  <span className="text-xs font-medium text-red-400 bg-background/80 px-2 py-1 rounded-full border border-red-400/30">
                    Need 3+ songs
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
