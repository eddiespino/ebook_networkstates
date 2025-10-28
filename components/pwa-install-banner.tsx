"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed"
        platform: string
    }>
    prompt(): Promise<void>
}

interface NavigatorStandalone extends Navigator {
    standalone?: boolean
}

export function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showBanner, setShowBanner] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Check if it's iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const ios = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(ios)

        // Check if user already dismissed the banner
        const dismissed = localStorage.getItem("pwa-banner-dismissed")
        if (dismissed) {
            return
        }

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            return
        }

        // Listen for beforeinstallprompt event (Android/Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setShowBanner(true)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

        // For iOS, show banner after 3 seconds if not dismissed
        const nav = window.navigator as NavigatorStandalone
        if (ios && !nav.standalone) {
            setTimeout(() => {
                setShowBanner(true)
            }, 3000)
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // If iOS, we can't trigger install programmatically
            // Just keep banner open for user to see instructions
            return
        }

        try {
            await deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === "accepted") {
                setShowBanner(false)
                localStorage.setItem("pwa-banner-dismissed", "true")
            }

            setDeferredPrompt(null)
        } catch (error) {
            console.error("Error installing PWA:", error)
        }
    }

    const handleDismiss = () => {
        setShowBanner(false)
        localStorage.setItem("pwa-banner-dismissed", "true")
    }

    if (!showBanner) {
        return null
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-5 duration-500 md:hidden">
            <div className="mx-4 mb-4 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-3 p-4">
                    <div className="shrink-0 mt-0.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Download className="h-5 w-5 text-primary" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                            Install this app
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {isIOS ? (
                                <>
                                    Tap the share button{" "}
                                    <span className="inline-flex items-center justify-center w-4 h-4 text-[10px]">
                                        ⎙
                                    </span>{" "}
                                    and select &quot;Add to Home Screen&quot;
                                </>
                            ) : (
                                "Add this app to your home screen for quick and easy access"
                            )}
                        </p>
                    </div>

                    <div className="flex items-start gap-2 shrink-0">
                        {!isIOS && deferredPrompt && (
                            <Button
                                size="sm"
                                onClick={handleInstall}
                                className="h-8 text-xs font-medium"
                            >
                                Install
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDismiss}
                            className="h-8 w-8 p-0"
                            aria-label="Dismiss banner"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
