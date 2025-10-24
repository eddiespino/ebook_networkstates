"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, Headphones } from "lucide-react"
import Link from "next/link"
import { downloadPdf } from "@/lib/pdf-config"
import { useEffect } from "react"

export function BookHero() {
  useEffect(() => {
    // Cargar el script de Unicorn Studio
    if (!window.UnicornStudio) {
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.innerHTML = `!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();`
      document.body.appendChild(script)
    }

    // Ocultar el badge de Unicorn Studio con CSS más agresivo
    const style = document.createElement("style")
    style.innerHTML = `
      [data-us-project] a,
      [data-us-project] a[href*="unicorn"],
      [data-us-project] > a,
      [data-us-project] div a,
      [data-us-project] * a,
      div[style*="unicorn"] a,
      .unicorn-badge,
      a[href*="unicorn.studio"],
      a[href*="unicorn"],
      [style*="z-index: 2147483647"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        position: absolute !important;
        left: -9999px !important;
      }
    `
    document.head.appendChild(style)

    const removeBadge = () => {
      const badges = document.querySelectorAll('a[href*="unicorn"]')
      badges.forEach((badge) => {
        badge.remove()
      })
    }


    const interval = setInterval(removeBadge, 100)


    const observer = new MutationObserver(removeBadge)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearInterval(interval)
      observer.disconnect()
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 overflow-hidden" suppressHydrationWarning>
      {/* Unicorn Studio Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          data-us-project="3uaIWMW9tCAMyUcYwSX2"
          className="w-full h-full"
          style={{ minHeight: '100vh', minWidth: '100%' }}
        />
      </div>


      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />

      <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/20 to-background/60" />

      <div className="relative z-10 w-full max-w-7xl mx-auto" suppressHydrationWarning>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Book Cover */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-1">
            <div className="relative group w-full max-w-sm lg:max-w-md">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Book container */}
              <div className="relative transform transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FKXExWzoEmHP46N0IcS5ySqmKTXaGS.png"
                  alt="The Digital Community Manifesto Book Cover"
                  width={500}
                  height={750}
                  className="rounded-xl shadow-2xl w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-xs sm:text-sm font-mono text-primary border border-primary/20 backdrop-blur-sm">
                First Edition • May 2025
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
                The Digital Community Manifesto
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed">
                Digital Rights, Game Theory, and Governance of Scalable Blockchains for Use in Network States
              </p>

              <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg text-muted-foreground justify-center lg:justify-start">
                <span>by</span>
                <a
                  href="https://peakd.com/@theycallmedan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-foreground font-medium hover:text-primary transition-colors"
                  suppressHydrationWarning
                >
                  @theycallmedan
                </a>
                <span>&</span>
                <a
                  href="https://peakd.com/@starkerz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-foreground font-medium hover:text-primary transition-colors"
                  suppressHydrationWarning
                >
                  @starkerz
                </a>
              </div>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A comprehensive guide to building truly decentralized communities that resist censorship, protect digital
              rights, and enable self-sovereign network states.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0" suppressHydrationWarning>
              <Link href="/read" className="w-full sm:w-auto" suppressHydrationWarning>
                <Button size="lg" className="gap-2 text-base w-full shadow-lg hover:shadow-xl transition-shadow">
                  <BookOpen className="w-5 h-5" />
                  Read Online
                </Button>
              </Link>
              <Link href="/audiobook" className="w-full sm:w-auto" suppressHydrationWarning>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base w-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
                >
                  <Headphones className="w-5 h-5" />
                  Listen Audiobook
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base w-full sm:w-auto bg-background/50 backdrop-blur-sm hover:bg-background/80"
                onClick={downloadPdf}
              >
                <Download className="w-5 h-5" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
