import { useEffect, useRef } from "react";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import {
  showErrorToast,
  showWarningToast,
} from "@/lib/toast-service";

interface UseAudioPlayerProps {
  audioSrc: string;
}

export const useAudioPlayer = ({ audioSrc }: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInitialized = useRef(false);

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

  // Inicializar el src del audio solo una vez
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasInitialized.current) return;

    // Asignar el src sin cargar automáticamente
    audio.src = audioSrc;
    hasInitialized.current = true;

    console.log("Audio source set (not loaded yet):", audioSrc);
  }, [audioSrc]);

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
      const audioElement = e.target as HTMLAudioElement;
      const errorDetails = {
        error: audioElement.error,
        errorCode: audioElement.error?.code,
        errorMessage: audioElement.error?.message,
        networkState: audioElement.networkState,
        readyState: audioElement.readyState,
        src: audioElement.src,
        currentSrc: audioElement.currentSrc,
      };

      console.error("Audio loading error:", errorDetails);
      console.error("Error completo:", e);

      let errorMessage = "Could not load audio file.";
      let errorTitle = "Playback error";
      let shouldShowToast = true;

      if (audioElement.error) {
        switch (audioElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Audio download aborted.";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage =
              "Network error while downloading audio. Check your connection.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage =
              "Error decoding audio file. The file may be corrupted.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorTitle = "CORS Error on Cloudflare R2";
            errorMessage =
              "The file needs CORS configuration in Cloudflare Worker. See CLOUDFLARE-WORKER-CORS.md";
            console.error(
              "💡 SOLUTION: Configure CORS in Cloudflare R2 Worker"
            );
            console.error("📖 Guide: CLOUDFLARE-WORKER-CORS.md");
            // Don't show toast for CORS error during initial load
            shouldShowToast = false;
            break;
        }
      } else {
        // Error without specific code - probably CORS
        console.warn(
          "Audio error without specific code - probably CORS"
        );
        shouldShowToast = false;
      }

      setIsPlaying(false);

      if (shouldShowToast) {
        showErrorToast(errorTitle, errorMessage);
      }
    };

    let bufferingTimeout: NodeJS.Timeout | null = null;

    const handleStalled = () => {
      console.warn("Audio playback stalled - buffering...");

      // Only show notification if buffering lasts more than 3 seconds
      bufferingTimeout = setTimeout(() => {
        showWarningToast("Buffering...", "Downloading audio content");
      }, 3000);
    };

    const handleWaiting = () => {
      console.log("Audio buffering...");
      // Don't show notification immediately
    };

    const handlePlaying = () => {
      // Clear buffering timeout if audio starts playing
      if (bufferingTimeout) {
        clearTimeout(bufferingTimeout);
        bufferingTimeout = null;
      }
    };

    const handleCanPlayThrough = () => {
      // Clear buffering timeout
      if (bufferingTimeout) {
        clearTimeout(bufferingTimeout);
        bufferingTimeout = null;
      }
    };

    // Don't force automatic loading - wait for user to click Play
    // This avoids CORS errors when loading the page
    // audio.load();

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);

    return () => {
      // Clear buffering timeout on unmount
      if (bufferingTimeout) {
        clearTimeout(bufferingTimeout);
      }

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    audio.removeEventListener("error", handleError);
    audio.removeEventListener("stalled", handleStalled);
    audio.removeEventListener("waiting", handleWaiting);
    audio.removeEventListener("playing", handlePlaying);
  };
}, [audioSrc, setDuration, setCurrentTime, setIsPlaying, currentTime]);

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
