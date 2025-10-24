"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
        document.addEventListener("mozfullscreenchange", handleFullscreenChange)
        document.addEventListener("MSFullscreenChange", handleFullscreenChange)

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
        }
    }, [])

    return (
        <footer className={`border-t border-border bg-background transition-all duration-300 ${isFullscreen ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group w-fit" suppressHydrationWarning>
                            <BookOpen className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
                            <span className="font-bold text-lg">Digital Manifesto</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A comprehensive guide to building truly decentralized communities that resist censorship and protect
                            digital rights.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#about"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    About the Book
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/read"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    Read Online
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/audiobook"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    Listen Audiobook
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Authors */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Authors</h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://peakd.com/@theycallmedan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    @theycallmedan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://peakd.com/@starkerz"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                                    suppressHydrationWarning
                                >
                                    @starkerz
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground text-center sm:text-left">
                            © {currentYear} The Digital Community Manifesto. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
