"use client";

import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import { useState, useEffect } from "react";

interface AudioPlayerProps {
    audioSrc: string;
    title?: string;
    author?: string;
    coverImage?: string;
}

export function AudioPlayer({
    audioSrc,
    title = "The Digital Community Manifesto",
    author = "NoSpirit & Starkerz",
    coverImage = "/book-cover.jpg",
}: AudioPlayerProps) {
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

    const { duration } = useAudioPlayerStore();
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(0.8);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const handleVolumeToggle = () => {
        if (volume > 0) {
            setPreviousVolume(volume);
            setVolume(0);
        } else {
            setVolume(previousVolume || 0.8);
        }
    };

    const getVolumeIcon = () => {
        if (volume === 0) return <VolumeX className="h-5 w-5" />;
        if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
        return <Volume2 className="h-5 w-5" />;
    };


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadStart = () => {
            setIsLoading(true);
            setHasError(false);
        };

        const handleCanPlay = () => {
            setIsLoading(false);
            setIsBuffering(false);
        };

        const handleWaiting = () => {
            setIsBuffering(true);
        };

        const handlePlaying = () => {
            setIsBuffering(false);
        };

        const handleError = () => {
            setHasError(true);
            setIsLoading(false);
            setIsBuffering(false);
        };

        audio.addEventListener("loadstart", handleLoadStart);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("loadstart", handleLoadStart);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("error", handleError);
        };
    }, [audioRef]);
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
    }, [isPlaying, volume, togglePlayPause, skipBackward, skipForward]);

    return (
        <Card className="w-full bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 shadow-2xl">
            <div className="p-6 md:p-8">
                {/* Estado de Error */}
                {hasError && (
                    <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-destructive">Error de reproducción</p>
                            <p className="text-xs text-destructive/80">No pudimos cargar el archivo de audio</p>
                        </div>
                    </div>
                )}

                {/* Indicador de Carga */}
                {isLoading && !hasError && (
                    <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3">
                        <Loader className="h-5 w-5 text-primary shrink-0 animate-spin" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary">Cargando audio...</p>
                            <p className="text-xs text-primary/80">Preparando el reproductor</p>
                        </div>
                    </div>
                )}

                {/* Indicador de Buffering */}
                {isBuffering && isPlaying && !isLoading && (
                    <div className="mb-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3">
                        <Loader className="h-5 w-5 text-yellow-500 shrink-0 animate-spin" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Descargando contenido...</p>
                            <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Buffering en progreso</p>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg shrink-0 group">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {isPlaying && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0ms" }} />
                                    <div className="w-1 h-6 bg-white animate-pulse" style={{ animationDelay: "150ms" }} />
                                    <div className="w-1 h-5 bg-white animate-pulse" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white truncate">{title}</h3>
                        <p className="text-sm text-zinc-400 truncate">{author}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 group">
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
                <div className="flex items-center justify-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skipBackward(15)}
                        className="text-white hover:bg-zinc-700 hover:scale-110 transition-all duration-200"
                        title="Retroceder 15s (J o ←)"
                    >
                        <SkipBack className="h-5 w-5" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={togglePlayPause}
                        className="h-14 w-14 rounded-full bg-white hover:bg-zinc-200 text-black shadow-lg hover:scale-110 transition-all duration-200"
                        title={isPlaying ? "Pausar (Space o K)" : "Reproducir (Space o K)"}
                    >
                        {isPlaying ? (
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
                        title="Adelantar 15s (L o →)"
                    >
                        <SkipForward className="h-5 w-5" />
                    </Button>
                </div>

                {/* Volume and Speed Controls */}
                <div className="flex items-center justify-between gap-4">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2 flex-1 group/volume">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleVolumeToggle}
                            className="text-white hover:bg-zinc-700 transition-all hover:scale-110"
                            title="Silenciar (M)"
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
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <details className="group">
                        <summary className="text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer list-none flex items-center justify-center gap-2 transition-colors">
                            <span>Keyboard Shortcuts</span>
                            <svg
                                className="w-3 h-3 transition-transform group-open:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">Space</kbd>
                                <span className="text-zinc-400">Play/Pause</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">M</kbd>
                                <span className="text-zinc-400">Mute</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">←</kbd>
                                <span className="text-zinc-400">-5 sec</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">→</kbd>
                                <span className="text-zinc-400">+5 sec</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">↑</kbd>
                                <span className="text-zinc-400">Vol +</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-2 py-1 bg-zinc-700 rounded text-zinc-300 font-mono">↓</kbd>
                                <span className="text-zinc-400">Vol -</span>
                            </div>
                        </div>
                    </details>
                </div>

                {/* Hidden Audio Element */}
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    preload="metadata"
                    crossOrigin="anonymous"
                />
            </div>
        </Card>
    );
}
