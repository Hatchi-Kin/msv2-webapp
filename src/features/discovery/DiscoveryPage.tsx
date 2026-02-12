import React, { useState } from "react";
import { Search, Sparkles, MessageSquare } from "lucide-react";
import { useDiscovery } from "@/hooks/useDiscovery";
import LibraryHeader from "@/features/library/LibraryHeader";
import ScoredTrackCard from "@/features/library/ScoredTrackCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DiscoveryPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const { results, loading, error, search, refine, hasBaseVector } =
    useDiscovery();
  const navigate = useNavigate();

  const [sliders, setSliders] = useState({
    digital_organic: 0,
    energy: 0,
    urban: 0,
    bass: 0,
  });

  // Effect to handle refinement when sliders change
  React.useEffect(() => {
    if (!hasBaseVector) return;

    const timer = setTimeout(() => {
      refine(sliders);
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [sliders, hasBaseVector]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
    // Reset sliders on new search
    setSliders({
      digital_organic: 0,
      energy: 0,
      urban: 0,
      bass: 0,
    });
  };

  const handleSliderChange = (key: keyof typeof sliders, value: number) => {
    setSliders((prev) => ({ ...prev, [key]: value }));
  };

  const sliderDefinitions = [
    {
      key: "digital_organic",
      label: "Timbre",
      low: "Organic",
      high: "Digital",
    },
    { key: "energy", label: "Energy", low: "Chill", high: "Aggressive" },
    { key: "urban", label: "Urban Nudge", low: "General", high: "Hip-Hop" },
    { key: "bass", label: "Bass Culture", low: "Clean", high: "Reggae" },
  ] as const;

  const handleFindSimilar = (trackId: number) => {
    navigate(`/library/similar/${trackId}`);
  };

  const handleViewArtist = (artistName: string) => {
    navigate(`/library/artists/${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="space-y-6 pt-6 pb-12">
      <LibraryHeader
        title="Discovery"
        subtitle="Search your library using natural language"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Controls (Cockpit) */}
        <div className="w-full lg:w-[350px] space-y-6 flex-shrink-0">
          <div className="glass-panel p-6 rounded-3xl space-y-6 sticky top-24">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. 'Chill lo-fi for working'"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-background/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <Button
                type="submit"
                className="w-full py-6 rounded-2xl font-bold flex items-center justify-center gap-2"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Explore
                  </>
                )}
              </Button>
            </form>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Semantic Search</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Powered by CLAP. It understands the "vibe" and "context" of
                    your words, not just keywords.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-primary/10">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="font-bold text-primary/80 uppercase mr-1">
                    Pro Tip:
                  </span>
                  Describe <strong>sounds</strong> (e.g., "warm bass",
                  "distorted") over just genres. The model is better at hearing
                  textures than understanding culture!
                </p>
              </div>
            </div>

            {/* Vibe Sliders */}
            <div
              className={`space-y-4 transition-all duration-500 ${hasBaseVector ? "opacity-100" : "opacity-40 grayscale pointer-events-none"}`}
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                  Refine Space
                </h4>
                {!hasBaseVector && (
                  <span className="text-[10px] uppercase font-bold text-primary/60 animate-pulse">
                    Search first to unlock
                  </span>
                )}
              </div>

              <div className="space-y-6 pt-2">
                {sliderDefinitions.map((slider) => (
                  <div key={slider.key} className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
                      <span className="text-muted-foreground">
                        {slider.low}
                      </span>
                      <span className="text-primary">{slider.label}</span>
                      <span className="text-muted-foreground">
                        {slider.high}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={sliders[slider.key]}
                      onChange={(e) =>
                        handleSliderChange(
                          slider.key,
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results Matrix (3x3 Grid) */}
        <div className="flex-1 min-h-[600px]">
          {error && (
            <div className="mb-6">
              <ErrorMessage title="Search failed" message={error} />
            </div>
          )}

          {!results.length && !loading && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border-dashed">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">Find your next vibe</h3>
              <p className="text-muted-foreground max-w-xs mt-2">
                Type something like "Dark atmospheric industrial" or "Happy
                upbeat acoustic folk" to begin exploration.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center">
              <LoadingSpinner message="Scanning your library's latent space..." />
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {results.slice(0, 9).map((scoredTrack, index) => (
                <div
                  key={scoredTrack.track.id}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  className="animate-in slide-in-from-bottom-2 fade-in fill-mode-both"
                >
                  <ScoredTrackCard
                    scoredTrack={scoredTrack}
                    onFindSimilar={handleFindSimilar}
                    onViewArtist={handleViewArtist}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
