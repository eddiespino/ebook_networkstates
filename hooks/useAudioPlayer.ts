import { useEffect, useRef, type RefObject } from "react";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import {
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from "@/lib/toast-service";

interface UseAudioPlayerProps {
  audioSrc: string;
}

export const useAudioPlayer = ({ audioSrc }: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    isPlaying,
    currentTime,
    volume,
    playbackRate,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setPlaybackRate,
  } = useAudioPlayerStore();

  // Load audio metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
        // Restore saved position
        if (currentTime > 0 && currentTime < audio.duration) {
          audio.currentTime = currentTime;
        }
      }
    };

    const handleDurationChange = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
      }
    };

    const handleCanPlay = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        isFinite(audio.duration)
      ) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      console.error("Audio loading error:", e);
      setIsPlaying(false);
      showErrorToast(
        "Error de reproducción",
        "No pudimos cargar el archivo de audio. Verifica tu conexión."
      );
    };

    const handleStalled = () => {
      console.warn("Audio playback stalled - buffering...");
      showWarningToast("Buffering...", "Descargando contenido de audio");
    };

    const handleWaiting = () => {
      console.log("Audio buffering...");
    };

    const handlePlaying = () => {
      console.log("Audio playing smoothly");
    };

    // Force load metadata
    audio.load();

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
    };
  }, [audioSrc]);

  // Control play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Update playback rate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const skipForward = (seconds: number = 15) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.min(audio.currentTime + seconds, audio.duration);
    seek(newTime);
  };

  const skipBackward = (seconds: number = 15) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(audio.currentTime - seconds, 0);
    seek(newTime);
  };

  const formatTime = (time: number): string => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    volume,
    playbackRate,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    setVolume,
    setPlaybackRate,
    formatTime,
  };
};
