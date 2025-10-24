"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { bookContent } from "@/lib/book-content"

export function BookReader() {
  const [currentChapter, setCurrentChapter] = useState(0)

  const nextChapter = () => {
    if (currentChapter < bookContent.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
    }
  }

  const chapter = bookContent.chapters[currentChapter]

  return (
    <section id="book-reader" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20 backdrop-blur-sm">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider">Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Read a Sample</h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the first chapters and see what this book has to offer
          </p>
        </div>

        <Card className="overflow-hidden border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
          <div className="grid lg:grid-cols-[280px_1fr]">

            <div className="border-r border-border/50 bg-muted/50 backdrop-blur-sm">
              <div className="p-4 sm:p-6 border-b border-border/50">
                <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
                  Table of Contents
                </h3>
              </div>
              <ScrollArea className="h-[500px] sm:h-[600px]">
                <div className="p-3 sm:p-4 space-y-1">
                  {bookContent.chapters.map((ch, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 ${currentChapter === index
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <div className="font-mono text-xs mb-1 opacity-80">Chapter {ch.number}</div>
                      <div className="font-medium line-clamp-2 text-sm">{ch.title}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex flex-col">
              <div className="p-4 sm:p-6 border-b border-border/50 bg-background/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-mono text-muted-foreground mb-1">
                      Chapter {chapter.number}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">{chapter.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevChapter}
                      disabled={currentChapter === 0}
                      className="hover:bg-primary/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextChapter}
                      disabled={currentChapter === bookContent.chapters.length - 1}
                      className="hover:bg-primary/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[500px] sm:h-[600px]">
                <div className="p-6 sm:p-8 prose prose-base sm:prose-lg dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">{chapter.content}</div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
