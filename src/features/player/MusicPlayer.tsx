import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UI_CONSTANTS } from "@/constants/ui";

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isRepeat,
    togglePlayPause,
    seekTo,
    setVolume,
    playNext,
    playPrevious,
    toggleRepeat,
  } = usePlayer();

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seekTo(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : UI_CONSTANTS.DEFAULT_VOLUME);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
      {/* Mobile Progress Bar (Top Edge) */}
      <div
        className="md:hidden w-full h-1 bg-muted cursor-pointer group relative"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-2 md:py-3">
        <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-between gap-2 md:gap-4">
          {/* Left: Track Info */}
          <div className="flex-1 min-w-0 mr-2 md:mr-0">
            <p className="text-sm font-medium text-tertiary-foreground truncate">
              {currentTrack?.title ||
                currentTrack?.filename ||
                "No track loaded"}
            </p>
            <p className="text-xs text-foreground opacity-70 truncate">
              {currentTrack?.artist || "Click play on a track"}
            </p>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={playPrevious}
              className="h-8 w-8 p-0"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={togglePlayPause}
              className="h-10 w-10 p-0 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={playNext}
              className="h-8 w-8 p-0"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Repeat button - only show when track is loaded, hidden on mobile */}
            {currentTrack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRepeat}
                className={cn(
                  "h-8 w-8 p-0 hidden md:inline-flex",
                  isRepeat && "text-primary"
                )}
                title={isRepeat ? "Repeat: On" : "Repeat: Off"}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Right: Progress Bar & Volume (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Progress Bar */}
            <div className="flex-1 flex items-center gap-2 min-w-[200px]">
              <span className="text-xs text-foreground opacity-70 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-2 bg-muted rounded-full cursor-pointer group relative"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" />
                </div>
              </div>
              <span className="text-xs text-foreground opacity-70 w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="h-8 w-8 p-0"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
