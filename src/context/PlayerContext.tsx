import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import type { MegasetTrack } from "@/types/api";
import config from "@/lib/config";
import { useAuth } from "@/context/AuthContext";

interface PlayerState {
  currentTrack: MegasetTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: MegasetTrack[];
  queueIndex: number;
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
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accessToken } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<MegasetTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<MegasetTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    // Load volume from localStorage
    const savedVolume = localStorage.getItem("player-volume");
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      audio.volume = vol;
      setVolumeState(vol);
    }

    // Event listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // Auto-play next track if in queue
      if (queueIndex < queue.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError as any);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError as any);
      audio.pause();
    };
  }, []);

  const playTrack = (track: MegasetTrack) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (!accessToken) {
      console.error("No access token found - user not authenticated");
      return;
    }

    console.log(
      "Playing track:",
      track.title || track.filename,
      "ID:",
      track.id
    );

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
        console.log(
          "Audio blob received, size:",
          blob.size,
          "type:",
          blob.type
        );
        const blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl;
        return audio.play();
      })
      .then(() => {
        console.log("Audio playback started");
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error streaming audio:", error);
        setIsPlaying(false);
      });
  };

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

  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = vol;
    setVolumeState(vol);
    localStorage.setItem("player-volume", vol.toString());
  };

  const playNext = () => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      playTrack(queue[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      playTrack(queue[prevIndex]);
    } else if (currentTime > 3) {
      // If more than 3 seconds in, restart current track
      seekTo(0);
    }
  };

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
        playTrack,
        togglePlayPause,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        addToQueue,
        clearQueue,
        playQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
