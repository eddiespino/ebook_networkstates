import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AudioChapter } from "@/lib/audiobook-chapters";

interface CurrentChapter {
  readonly chapter: AudioChapter | null;
  readonly audioUrl: string;
}

interface AudioPlayerState {
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly playbackRate: number;
  readonly currentChapter: CurrentChapter;

  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setCurrentChapter: (chapter: AudioChapter) => void;
  playChapter: (chapter: AudioChapter) => void; // Nueva función para interacción del usuario
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  playbackRate: 1,
  currentChapter: { chapter: null, audioUrl: "" },
};

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set) => ({
      ...initialState,

      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setCurrentTime: (time: number) => set({ currentTime: time }),
      setDuration: (duration: number) => set({ duration }),
      setVolume: (volume: number) => set({ volume }),
      setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
      setCurrentChapter: (chapter: AudioChapter) =>
        set({
          currentChapter: {
            chapter,
            audioUrl: chapter.audioUrl,
          },
          currentTime: 0,
          duration: 0,
          // NO establecer isPlaying automáticamente
          // El usuario debe hacer clic en Play para cumplir con políticas del navegador
        }),
      playChapter: (chapter: AudioChapter) =>
        set({
          currentChapter: {
            chapter,
            audioUrl: chapter.audioUrl,
          },
          currentTime: 0,
          duration: 0,
          isPlaying: true, // SÍ auto-play porque es interacción del usuario
        }),
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
      }),
    }
  )
);
