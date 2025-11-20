import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { MegasetTrack } from "@/types/api";
import config from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { setStopMusicCallback } from "@/context/authCallbacks";
import { UI_CONSTANTS } from "@/constants/ui";

interface PlayerState {
  currentTrack: MegasetTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: MegasetTrack[];
  queueIndex: number;
  isRepeat: boolean;
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: MegasetTrack) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: MegasetTrack) => void;
  clearQueue: () => void;
  playQueue: (tracks: MegasetTrack[], startIndex?: number) => void;
  toggleRepeat: () => void;
  stopMusic: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<MegasetTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const savedVolume = localStorage.getItem("player-volume");
    return savedVolume ? parseFloat(savedVolume) : UI_CONSTANTS.DEFAULT_VOLUME;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<MegasetTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial volume from state
    const logarithmicVolume = volume * volume;
    audio.volume = logarithmicVolume;

    // Event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // If repeat is on, restart current track
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      // Auto-play next track if in queue
      if (queueIndex < queue.length - 1) {
        const nextIndex = queueIndex + 1;
        setQueueIndex(nextIndex);
        // Will trigger playback via separate effect
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIndex, queue.length, isRepeat]); // Added isRepeat

  const playTrack = useCallback(
    (track: MegasetTrack) => {
      if (!audioRef.current) return;

      const audio = audioRef.current;

      if (!accessToken) {
        console.error("No access token found - user not authenticated");
        return;
      }

      // Set new track
      setCurrentTrack(track);
      setCurrentTime(0);

      // Update audio source with auth header via fetch
      // Note: We need to use fetch to add auth header, then create blob URL
      const streamUrl = `${config.apiUrl}/stream/audio`;

      fetch(streamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ track_id: track.id }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error(
              "Stream response not OK:",
              response.status,
              response.statusText
            );
            throw new Error(`Failed to stream audio: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          audio.src = blobUrl;
          return audio.play();
        })
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error streaming audio:", error);
          setIsPlaying(false);
        });
    },
    [accessToken]
  );

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;

    // Convert linear slider to logarithmic volume (human hearing is logarithmic)
    // Formula: volume = (e^(slider) - 1) / (e - 1)
    // Simplified: volume = slider^2 for easier calculation
    const logarithmicVolume = vol * vol;

    audioRef.current.volume = logarithmicVolume;
    setVolumeState(vol); // Store linear value for slider
    localStorage.setItem("player-volume", vol.toString());
  }, []);

  const playNext = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      playTrack(queue[nextIndex]);
    }
  }, [queueIndex, queue, playTrack]);

  const playPrevious = useCallback(() => {
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      playTrack(queue[prevIndex]);
    } else if (currentTime > UI_CONSTANTS.TRACK_RESTART_THRESHOLD) {
      // If more than threshold seconds in, restart current track
      seekTo(0);
    }
  }, [queueIndex, queue, playTrack, currentTime, seekTo]);

  const addToQueue = (track: MegasetTrack) => {
    setQueue((prev) => [...prev, track]);
  };

  const clearQueue = () => {
    setQueue([]);
    setQueueIndex(0);
  };

  const playQueue = (tracks: MegasetTrack[], startIndex: number = 0) => {
    if (tracks.length === 0) return;

    setQueue(tracks);
    setQueueIndex(startIndex);
    playTrack(tracks[startIndex]);
  };

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const stopMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = "";
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Register stopMusic callback with AuthContext
  useEffect(() => {
    setStopMusicCallback(stopMusic);
  }, [stopMusic]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        queue,
        queueIndex,
        isRepeat,
        playTrack,
        togglePlayPause,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        addToQueue,
        clearQueue,
        playQueue,
        toggleRepeat,
        stopMusic,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
