"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Headphones, BookOpen, Download, PlayCircle } from "lucide-react"
import { downloadPdf } from "@/lib/pdf-config"
import { AudioPlayer } from "@/components/audio-player"
import { AudiobookSEO } from "./seo"
import { audiobookData } from "@/lib/audiobook-chapters"
import { useAudioPlayerStore } from "@/store/audioPlayerStore"
import { useCurrentChapter } from "@/hooks/useCurrentChapter"

export function AudiobookClient() {
    const { currentChapter, setCurrentChapter, playChapter } = useAudioPlayerStore()
    const { goToChapter } = useCurrentChapter()

    // Inicializar con el primer capítulo si no hay capítulo seleccionado
    useEffect(() => {
        if (!currentChapter.chapter && audiobookData.chapters.length > 0) {
            setCurrentChapter(audiobookData.chapters[0])
        }
    }, [currentChapter.chapter, setCurrentChapter])

    // Obtener el audioUrl del capítulo actual
    const audioSrc = currentChapter.audioUrl || audiobookData.chapters[0]?.audioUrl || ""

    return (
        <div className="min-h-screen bg-background pt-20">
            <AudiobookSEO />
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" suppressHydrationWarning>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Home</span>
                                <span className="sm:hidden">Home</span>
                            </Button>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Link href="/read" suppressHydrationWarning>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="hidden sm:inline">Read Book</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8 sm:mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-mono text-primary border border-primary/20 backdrop-blur-sm">
                            <Headphones className="w-5 h-5" />
                            <span className="uppercase tracking-wider">Audiobook</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                            Listen to the Audiobook
                        </h1>

                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Experience The Digital Community Manifesto in audio format. Perfect for listening while commuting or
                            multitasking.
                        </p>
                    </div>

                    {/* Audio Player Card */}
                    <div className="mb-8">
                        <AudioPlayer
                            audioSrc={audioSrc}
                            title={currentChapter.chapter?.title || "The Digital Community Manifesto"}
                            author={audiobookData.author}
                            coverImage={currentChapter.chapter?.coverImage || audiobookData.coverImage}
                        />
                    </div>

                    {/* Current Chapter Description */}
                    {currentChapter.chapter && (
                        <Card className="p-4 sm:p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                                    <Headphones className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
                                    <h3 className="text-base sm:text-lg font-semibold wrap-break-word">
                                        Chapter {currentChapter.chapter.id}: {currentChapter.chapter.title}
                                    </h3>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {currentChapter.chapter.description}
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Chapters List */}
                    <Card className="p-4 sm:p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="text-lg sm:text-xl font-bold">All Chapters</h3>
                                <span className="text-sm text-muted-foreground">
                                    {audiobookData.chapters.length} chapters
                                </span>
                            </div>
                            <div className="space-y-2 max-h-[60vh] sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                {audiobookData.chapters.map((chapter) => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => playChapter(chapter)}
                                        className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98] ${currentChapter.chapter?.id === chapter.id
                                            ? "border-primary bg-primary/10"
                                            : "border-border/50"
                                            }`}
                                        aria-label={`Play chapter ${chapter.id}: ${chapter.title}`}
                                    >
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className="shrink-0">
                                                {currentChapter.chapter?.id === chapter.id ? (
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-primary flex items-center justify-center">
                                                        <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-muted flex items-center justify-center text-xs sm:text-sm font-bold">
                                                        {chapter.id}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold mb-1 text-sm sm:text-base line-clamp-1">
                                                    {chapter.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                    {chapter.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Info Card */}
                    <Card className="p-4 sm:p-6 md:p-8 border-border/50 bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start sm:items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                    <Headphones className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm sm:text-base">Professional Audio Player</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                        Full-featured player with speed control, keyboard shortcuts, and progress saving
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-border/50">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Chapters</p>
                                    <p className="text-sm font-semibold">{audiobookData.chapters.length} Total</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Speed</p>
                                    <p className="text-sm font-semibold">0.5x - 2x</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Progress</p>
                                    <p className="text-sm font-semibold">Auto-saved</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Shortcuts</p>
                                    <p className="text-sm font-semibold">Keyboard</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Additional Options */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                        <Card className="p-4 sm:p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Read the Book</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        Prefer reading? Access the full PDF version online.
                                    </p>
                                    <Link href="/read" suppressHydrationWarning className="block">
                                        <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                                            Read Online
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Download PDF</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                        Get the PDF version to read offline anytime.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs sm:text-sm"
                                        onClick={downloadPdf}
                                    >
                                        Download Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* About Section */}
                    <Card className="p-4 sm:p-6 md:p-8 border-border/50 bg-muted/30">
                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About the Audiobook</h3>
                        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                            <p>
                                The Digital Community Manifesto audiobook brings the principles of decentralization, digital rights, and
                                network states to life through an engaging audio format with 25 professionally narrated chapters.
                            </p>
                            <p>
                                Perfect for busy individuals who want to learn about building truly decentralized communities while on
                                the go. Listen during your commute, workout, or while doing household tasks.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
