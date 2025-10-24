import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;

  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  reset: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set) => ({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playbackRate: 1,

      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setCurrentTime: (time: number) => set({ currentTime: time }),
      setDuration: (duration: number) => set({ duration }),
      setVolume: (volume: number) => set({ volume }),
      setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
      reset: () =>
        set({
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        }),
    }),
    {
      name: "audiobook-player-storage",
      partialize: (state: AudioPlayerState) => ({
        volume: state.volume,
        playbackRate: state.playbackRate,
        currentTime: state.currentTime,
      }),
    }
  )
);
