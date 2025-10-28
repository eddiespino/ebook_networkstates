/**
 * Hook personalizado para gestionar el capítulo actual del audiolibro
 * Proporciona funciones de navegación y información del capítulo
 * Inspirado en el patrón de Midu Dev (useCurrentMusic)
 */

import { useCallback, useMemo } from "react";
import {
  type AudioChapter,
  audiobookData,
  getNextChapter,
  getPreviousChapter,
} from "@/lib/audiobook-chapters";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";

interface UseCurrentChapterReturn {
  readonly currentChapter: AudioChapter | null;
  readonly nextChapter: AudioChapter | null;
  readonly previousChapter: AudioChapter | null;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
  readonly goToNextChapter: () => void;
  readonly goToPreviousChapter: () => void;
  readonly goToChapter: (chapterId: number) => void;
  readonly totalChapters: number;
  readonly currentChapterIndex: number;
}

/**
 * Hook para gestionar el capítulo actual del audiolibro
 * Proporciona información del capítulo actual y funciones de navegación
 */
export const useCurrentChapter = (): UseCurrentChapterReturn => {
  const { currentChapter, playChapter, setCurrentChapter, isPlaying } =
    useAudioPlayerStore();

  // Extraer el capítulo de la estructura del store
  const chapter = currentChapter.chapter;

  // Obtener el siguiente capítulo (memoizado)
  const nextChapter = useMemo(
    () => (chapter ? getNextChapter(chapter.id) : null),
    [chapter]
  );

  // Obtener el capítulo anterior (memoizado)
  const previousChapter = useMemo(
    () => (chapter ? getPreviousChapter(chapter.id) : null),
    [chapter]
  );

  // Verificar si hay siguiente capítulo
  const hasNext = nextChapter !== null && nextChapter !== undefined;

  // Verificar si hay capítulo anterior
  const hasPrevious = previousChapter !== null && previousChapter !== undefined;

  // Total de capítulos
  const totalChapters = audiobookData.chapters.length;

  // Índice del capítulo actual (basado en 0)
  const currentChapterIndex = useMemo(
    () =>
      chapter
        ? audiobookData.chapters.findIndex((ch) => ch.id === chapter.id)
        : -1,
    [chapter]
  );

  // Ir al siguiente capítulo
  const goToNextChapter = useCallback(() => {
    if (nextChapter) {
      // Solo auto-reproducir si ya estaba reproduciendo
      if (isPlaying) {
        playChapter(nextChapter);
      } else {
        setCurrentChapter(nextChapter);
      }
    }
  }, [nextChapter, playChapter, setCurrentChapter, isPlaying]);

  // Ir al capítulo anterior
  const goToPreviousChapter = useCallback(() => {
    if (previousChapter) {
      // Solo auto-reproducir si ya estaba reproduciendo
      if (isPlaying) {
        playChapter(previousChapter);
      } else {
        setCurrentChapter(previousChapter);
      }
    }
  }, [previousChapter, playChapter, setCurrentChapter, isPlaying]);

  // Ir a un capítulo específico por ID
  const goToChapter = useCallback(
    (chapterId: number) => {
      const targetChapter = audiobookData.chapters.find(
        (ch) => ch.id === chapterId
      );
      if (targetChapter) {
        // Solo auto-reproducir si ya estaba reproduciendo
        if (isPlaying) {
          playChapter(targetChapter);
        } else {
          setCurrentChapter(targetChapter);
        }
      }
    },
    [playChapter, setCurrentChapter, isPlaying]
  );

  return {
    currentChapter: chapter,
    nextChapter: nextChapter ?? null,
    previousChapter: previousChapter ?? null,
    hasNext,
    hasPrevious,
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    totalChapters,
    currentChapterIndex,
  };
};
