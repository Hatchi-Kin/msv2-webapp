import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { MegasetTrack } from "@/types/api";
import { useAuth } from "@/context/AuthContext";
import { setStopMusicCallback } from "@/context/authCallbacks";
import { UI_CONSTANTS } from "@/constants/ui";
import { media } from "@/lib/api";

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

  // Queue state refs so the audio 'ended' listener can access latest without re-subscribing
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const isRepeatRef = useRef(isRepeat);

  useEffect(() => {
    queueRef.current = queue;
    queueIndexRef.current = queueIndex;
    isRepeatRef.current = isRepeat;
  }, [queue, queueIndex, isRepeat]);

  // Global Audio Initialization
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial volume
    const savedVolume = localStorage.getItem("player-volume");
    if (savedVolume) {
      const v = parseFloat(savedVolume);
      audio.volume = v * v;
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);

    const handleEnded = () => {
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.error("Repeat play failed:", e));
        return;
      }

      const q = queueRef.current;
      const idx = queueIndexRef.current;

      if (idx < q.length - 1) {
        const nextIndex = idx + 1;
        setQueueIndex(nextIndex);
        // Note: The playNext logic actually needs to call playTrack via a separate queue processor or effect in a real app,
        // but since we rely on useEffect for queue watching, we will just trigger state.
        // An anti-pattern was here before. Let's fix it by setting state and an effect will handle it.
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
      audio.src = "";
    };
  }, []); // Run ONCE on mount

  // Watch for queue index change after audio ended to trigger next song
  useEffect(() => {
    if (queue.length > 0 && queueIndex > 0 && queue[queueIndex]) {
      // Did we auto-advance? Let's check if the audio is paused and we have a current track mismatch
      if (
        currentTrack?.id !== queue[queueIndex].id &&
        !isPlaying &&
        currentTime > 0
      ) {
        playTrack(queue[queueIndex]);
      }
    }
  }, [queueIndex, queue, currentTrack, isPlaying, currentTime]);

  const currentTrackRef = useRef(currentTrack);
  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrackRef.current) return;
    const audio = audioRef.current;
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const playTrack = useCallback(
    (track: MegasetTrack) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;

      if (!accessToken) {
        console.error("No access token found - user not authenticated");
        return;
      }

      // If playing the same track, just toggle it to prevent creating 2 streams
      if (currentTrackRef.current?.id === track.id) {
        if (audio.paused) {
          audio.play().catch(console.error);
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      // Pause current stream before loading new one
      audio.pause();
      audio.removeAttribute("src"); // Clean completely

      // Set new track
      setCurrentTrack(track);
      setCurrentTime(0);

      // Stream audio using the media API
      media
        .streamAudio(track.id, accessToken)
        .then((blob: Blob) => {
          const blobUrl = URL.createObjectURL(blob);
          audio.src = blobUrl;
          return audio.play();
        })
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error: Error) => {
          console.error("Error streaming audio:", error);
          setIsPlaying(false);
        });
    },
    [accessToken],
  );

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
