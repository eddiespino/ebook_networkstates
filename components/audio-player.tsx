"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useCurrentChapter } from "@/hooks/useCurrentChapter";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog";
import {
    Play,
    Pause,
    Volume2,
    Volume1,
    VolumeX,
    SkipForward,
    SkipBack,
    Gauge,
    AlertCircle,
    Loader,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

interface AudioPlayerProps {
    audioSrc: string;
    title?: string;
    author?: string;
    coverImage?: string;
    onEnded?: () => void;
}

export function AudioPlayer({
    audioSrc,
    title = "The Digital Community Manifesto",
    author = "NoSpirit & Starkerz",
    coverImage = "/book-cover.jpg",
    onEnded,
}: AudioPlayerProps) {
    const previousSrcRef = useRef<string>("");
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasResetOnMountRef = useRef<boolean>(false); // Flag para resetear solo una vez

    const {
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
    } = useAudioPlayer({ audioSrc });

    const {
        hasNext,
        hasPrevious,
        goToNextChapter,
        goToPreviousChapter,
        currentChapterIndex,
        totalChapters,
    } = useCurrentChapter();

    const { duration, setIsPlaying } = useAudioPlayerStore();
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.8);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    /**
     * Fade out del audio actual
     * Reduce gradualmente el volumen antes de cambiar de capítulo
     */
    const fadeOut = useCallback(
        (callback: () => void) => {
            if (!audioRef.current || isFading) return;

            setIsFading(true);
            const audio = audioRef.current;
            const startVolume = audio.volume;
            const fadeSteps = 20;
            const stepDuration = 15; // ms
            let currentStep = 0;

            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }

            fadeIntervalRef.current = setInterval(() => {
                currentStep++;
                const newVolume = startVolume * (1 - currentStep / fadeSteps);
                audio.volume = Math.max(0, newVolume);

                if (currentStep >= fadeSteps) {
                    if (fadeIntervalRef.current) {
                        clearInterval(fadeIntervalRef.current);
                        fadeIntervalRef.current = null;
                    }
                    audio.volume = volume; // Restaurar volumen original
                    setIsFading(false);
                    callback();
                }
            }, stepDuration);
        },
        [audioRef, volume, isFading]
    );

    /**
     * Fade in del nuevo audio
     * Aumenta gradualmente el volumen después de cargar
     */
    const fadeIn = useCallback(async () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const targetVolume = volume;
        const fadeSteps = 20;
        const stepDuration = 15; // ms
        let currentStep = 0;

        audio.volume = 0;

        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }

        fadeIntervalRef.current = setInterval(() => {
            currentStep++;
            const newVolume = targetVolume * (currentStep / fadeSteps);
            audio.volume = Math.min(targetVolume, newVolume);

            if (currentStep >= fadeSteps) {
                if (fadeIntervalRef.current) {
                    clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = null;
                }
                audio.volume = targetVolume;
            }
        }, stepDuration);
    }, [audioRef, volume]);

    // Detectar cambio de capítulo y aplicar fade in si está reproduciendo
    useEffect(() => {
        if (audioSrc && audioSrc !== previousSrcRef.current) {
            previousSrcRef.current = audioSrc;

            // Reset error and loading states
            setHasError(false);
            setIsLoading(true);

            // Si está marcado para reproducir (isPlaying del store es true)
            // aplicar fade in cuando el audio esté listo
            const audio = audioRef.current;
            if (audio && isPlaying) {
                const handleCanPlay = () => {
                    fadeIn();
                    audio.removeEventListener("canplay", handleCanPlay);
                };
                audio.addEventListener("canplay", handleCanPlay);
            }
        }
    }, [audioSrc, audioRef, isPlaying, fadeIn]);

    const handleVolumeToggle = useCallback(() => {
        if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
        } else {
            setVolume(previousVolume || 0.8);
        }
    }, [volume, previousVolume, setVolume]);

    /**
     * Cambiar al siguiente capítulo con transición suave
     */
    const handleNextChapter = useCallback(() => {
        if (!hasNext || isFading) return;

        fadeOut(() => {
            goToNextChapter();
        });
    }, [hasNext, isFading, fadeOut, goToNextChapter]);

    /**
     * Cambiar al capítulo anterior con transición suave
     */
    const handlePreviousChapter = useCallback(() => {
        if (!hasPrevious || isFading) return;

        fadeOut(() => {
            goToPreviousChapter();
        });
    }, [hasPrevious, isFading, fadeOut, goToPreviousChapter]);

    // Resetear el audio al montar el componente (recarga de página)
    useEffect(() => {
        if (!hasResetOnMountRef.current) {
            hasResetOnMountRef.current = true;

            // Al recargar la página, resetear el estado del reproductor
            const audio = audioRef.current;
            if (audio) {
                // Solo pausar si el audio está en un estado que lo permite
                try {
                    if (!audio.paused) {
                        audio.pause();
                    }
                    audio.currentTime = 0;
                } catch (error) {
                    // Ignorar errores de pause() en audio no iniciado
                }
                setIsPlaying(false);
            }
        }
    }, []); // Solo ejecutar una vez al montar

    // Limpiar intervalos al desmontar
    useEffect(() => {
        return () => {
            if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
            }
        };
    }, []);

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="h-5 w-5" />;
        if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
        return <Volume2 className="h-5 w-5" />;
    };


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let bufferingTimeout: NodeJS.Timeout | null = null;

        const handleLoadStart = () => {
            setIsLoading(true);
            setHasError(false);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
        };

        const handleCanPlayThrough = () => {
            setIsLoading(false);
            setIsBuffering(false);
        };

        const handleWaiting = () => {
            // Solo mostrar buffering después de 500ms de espera
            bufferingTimeout = setTimeout(() => {
                setIsBuffering(true);
            }, 500);
        };

        const handlePlaying = () => {
            setIsBuffering(false);
            setIsLoading(false);

            // Limpiar timeout de buffering
            if (bufferingTimeout) {
                clearTimeout(bufferingTimeout);
                bufferingTimeout = null;
            }
        };

        const handleError = () => {
            setHasError(true);
            setIsLoading(false);
            setIsBuffering(false);
        };

        const handleEnded = () => {
            // Auto-avanzar al siguiente capítulo si existe
            if (hasNext) {
                goToNextChapter();
            }

            // Llamar al callback externo si existe
            if (onEnded) {
                onEnded();
            }
        };

        audio.addEventListener("loadstart", handleLoadStart);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("canplaythrough", handleCanPlayThrough);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("error", handleError);
        audio.addEventListener("ended", handleEnded);

        return () => {
            // Limpiar timeout al desmontar
            if (bufferingTimeout) {
                clearTimeout(bufferingTimeout);
            }

            audio.removeEventListener("loadstart", handleLoadStart);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("error", handleError);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioRef, onEnded, hasNext, goToNextChapter]);
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Evitar conflictos con inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case "arrowleft":
                case "j":
                    e.preventDefault();
                    skipBackward(5);
                    break;
                case "arrowright":
                case "l":
                    e.preventDefault();
                    skipForward(5);
                    break;
                case "m":
                    e.preventDefault();
                    handleVolumeToggle();
                    break;
                case "arrowup":
                    e.preventDefault();
                    setVolume(Math.min(volume + 0.1, 1));
                    break;
                case "arrowdown":
                    e.preventDefault();
                    setVolume(Math.max(volume - 0.1, 0));
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isPlaying, volume, togglePlayPause, skipBackward, skipForward, setVolume, handleVolumeToggle]);

    return (
        <Card className="w-full bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 shadow-2xl">
            <div className="p-4 md:p-5">
                {/* Estado de Error - Compacto */}
                {hasError && (
                    <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                        <p className="text-xs font-medium text-destructive">Could not load audio file</p>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg shrink-0 group">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        {/* Indicador de carga en la portada */}
                        {(isLoading || isFading) && !hasError && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader className="h-5 w-5 text-white animate-spin" />
                            </div>
                        )}

                        {/* Indicador de buffering en la portada */}
                        {isBuffering && isPlaying && !isLoading && !isFading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader className="h-4 w-4 text-yellow-400 animate-spin" />
                            </div>
                        )}

                        {/* Animación de reproducción */}
                        {isPlaying && !isLoading && !isBuffering && !isFading && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="flex gap-0.5">
                                    <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: "0ms" }} />
                                    <div className="w-0.5 h-4 bg-white animate-pulse" style={{ animationDelay: "150ms" }} />
                                    <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{title}</h3>
                        <p className="text-xs text-zinc-400 truncate">{author}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3 group">
                    <Slider
                        value={[currentTime]}
                        max={duration > 0 ? duration : 100}
                        step={0.1}
                        onValueChange={([value]) => seek(value)}
                        className="w-full cursor-pointer transition-all"
                        disabled={!duration || duration === 0}
                    />
                    <div className="flex justify-between text-xs text-zinc-400 mt-2 font-mono">
                        <span className="tabular-nums">{formatTime(currentTime)}</span>
                        <span className="tabular-nums">
                            {duration > 0 ? formatTime(duration) : "Loading..."}
                        </span>
                    </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                    {/* Previous Chapter Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousChapter}
                        disabled={!hasPrevious || isFading}
                        className="text-white hover:bg-zinc-700 hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title={hasPrevious ? "Previous chapter" : "No previous chapter"}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipBackward(15)}
                        className="text-white hover:bg-zinc-700 hover:scale-110 transition-all duration-200"
                        title="Rewind 15s (J or ←)"
                    >
                        <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={togglePlayPause}
                        className="h-14 w-14 rounded-full bg-white hover:bg-zinc-200 text-black shadow-lg hover:scale-110 transition-all duration-200"
                        title={isPlaying ? "Pause (Space or K)" : "Play (Space or K)"}
                        disabled={isFading}
                    >
                        {isFading ? (
                            <Loader className="h-6 w-6 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                        ) : (
                            <Play className="h-6 w-6 fill-current ml-1" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipForward(15)}
                        className="text-white hover:bg-zinc-700 hover:scale-110 transition-all duration-200"
                        title="Forward 15s (L or →)"
                    >
                        <SkipForward className="h-5 w-5" />
                    </Button>

                    {/* Next Chapter Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextChapter}
                        disabled={!hasNext || isFading}
                        className="text-white hover:bg-zinc-700 hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title={hasNext ? "Next chapter" : "No next chapter"}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                {/* Chapter Info */}
                {currentChapterIndex >= 0 && (
                    <div className="text-center mb-3">
                        <p className="text-xs text-zinc-400">
                            Chapter {currentChapterIndex + 1} of {totalChapters}
                        </p>
                    </div>
                )}

                {/* Volume and Speed Controls */}
                <div className="flex items-center justify-between gap-4">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2 flex-1 group/volume">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleVolumeToggle}
                            className="text-white hover:bg-zinc-700 transition-all hover:scale-110"
                            title="Mute (M)"
                        >
                            {getVolumeIcon()}
                        </Button>
                        <Slider
                            value={[volume * 100]}
                            max={100}
                            step={1}
                            onValueChange={([value]) => setVolume(value / 100)}
                            className="w-24 cursor-pointer"
                        />
                        <span className="text-xs text-zinc-400 w-10 text-right tabular-nums opacity-0 group-hover/volume:opacity-100 transition-opacity">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>

                    {/* Playback Speed */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                            className="text-white hover:bg-zinc-700 gap-2 hover:scale-105 transition-all"
                        >
                            <Gauge className="h-4 w-4" />
                            <span className="text-sm font-medium tabular-nums">{playbackRate}x</span>
                        </Button>

                        {showSpeedMenu && (
                            <div className="absolute bottom-full right-0 mb-2 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 py-2 min-w-[100px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                {playbackRates.map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => {
                                            setPlaybackRate(rate);
                                            setShowSpeedMenu(false);
                                        }}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 transition-colors tabular-nums ${playbackRate === rate
                                            ? "text-primary font-semibold bg-zinc-700/50"
                                            : "text-white"
                                            }`}
                                    >
                                        {rate}x {rate === 1 && "(Normal)"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Keyboard Shortcuts Button */}
                    <KeyboardShortcutsDialog mode="audio" />
                </div>

                {/* Hidden Audio Element */}
                <audio
                    ref={audioRef}
                    preload="none"
                />
            </div>
        </Card>
    );
}
