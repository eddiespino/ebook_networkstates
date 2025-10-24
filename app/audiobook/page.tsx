"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Headphones, BookOpen, Download } from "lucide-react"
import { downloadPdf } from "@/lib/pdf-config"
import { getAudioUrl } from "@/lib/cloudflare-config"
import { AudioPlayer } from "@/components/audio-player"

export default function AudiobookPage() {
    // 🎵 Audio desde Cloudflare R2 (normalizado a URL absoluta)
    const audioSrc = getAudioUrl()

    if (!audioSrc) {
        throw new Error("NEXT_PUBLIC_AUDIO_URL no está configurada en .env.local")
    }

    return (
        <div className="min-h-screen bg-background pt-20">
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
                            title="The Digital Community Manifesto"
                            author="@theycallmedan & @starkerz"
                            coverImage="/book-cover.jpg"
                        />
                    </div>

                    {/* Info Card */}
                    <Card className="p-6 sm:p-8 border-border/50 bg-card/50 backdrop-blur-sm mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Headphones className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Professional Audio Player</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Full-featured player with speed control, keyboard shortcuts, and progress saving
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Speed Control</p>
                                    <p className="text-sm font-semibold">0.5x - 2x</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Skip</p>
                                    <p className="text-sm font-semibold">±15 seconds</p>
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
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2">Read the Book</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Prefer reading? Access the full PDF version online.
                                    </p>
                                    <Link href="/read" suppressHydrationWarning>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Read Online
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Download className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2">Download PDF</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Get the PDF version to read offline anytime.
                                    </p>
                                    <Button variant="outline" size="sm" className="w-full" onClick={downloadPdf}>
                                        Download Now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* About Section */}
                    <Card className="mt-8 p-6 sm:p-8 border-border/50 bg-muted/30">
                        <h3 className="text-xl font-bold mb-4">About the Audiobook</h3>
                        <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                            <p>
                                The Digital Community Manifesto audiobook brings the principles of decentralization, digital rights, and
                                network states to life through an engaging audio format.
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
