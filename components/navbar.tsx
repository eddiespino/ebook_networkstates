"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" suppressHydrationWarning>
                        <div className="relative">
                            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-bold text-lg sm:text-xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                            Digital Manifesto
                        </span>
                    </Link>


                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            suppressHydrationWarning
                        >
                            Home
                        </Link>
                        <Link
                            href="/#about"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            suppressHydrationWarning
                        >
                            About
                        </Link>
                        <Link
                            href="/read"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            suppressHydrationWarning
                        >
                            Read Online
                        </Link>
                        <Link
                            href="/audiobook"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            suppressHydrationWarning
                        >
                            Audiobook
                        </Link>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 transition-transform hover:rotate-180 duration-500" />
                            ) : (
                                <Moon className="h-5 w-5 transition-transform hover:-rotate-12 duration-300" />
                            )}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-full"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                suppressHydrationWarning
                            >
                                Home
                            </Link>
                            <Link
                                href="/#about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                suppressHydrationWarning
                            >
                                About
                            </Link>
                            <Link
                                href="/read"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                suppressHydrationWarning
                            >
                                Read Online
                            </Link>
                            <Link
                                href="/audiobook"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                                suppressHydrationWarning
                            >
                                Audiobook
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
