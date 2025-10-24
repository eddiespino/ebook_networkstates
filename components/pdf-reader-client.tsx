"use client"

import { useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Home, BookOpen, Scroll, ZoomIn, ZoomOut, Maximize2, AlertCircle, Loader } from "lucide-react"
import Link from "next/link"
import { downloadPdf } from "@/lib/pdf-config"
import { usePDFReader } from "@/hooks/usePDFReader"
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog"
import { showErrorToast, showWarningToast } from "@/lib/toast-service"

import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFReaderClientProps {
    pdfUrl: string
}

export function PDFReaderClient({ pdfUrl }: PDFReaderClientProps) {
    const {
        numPages,
        pageNumber,
        scale,
        readingMode,
        pageWidth,
        pageHeight,
        isFullscreen,
        containerRef,
        scrollContainerRef,
        setNumPages,
        goToPrevPage,
        goToNextPage,
        goToPage,
        zoomIn,
        zoomOut,
        resetZoom,
        toggleFullscreen,
        setReadingMode,
        handleTouchStart,
        handleTouchEnd,
        pagesToRender,
    } = usePDFReader({ storageKey: "book-pdf-reader" })

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Memoizar las opciones del Document para evitar recargas innecesarias
    const documentOptions = useMemo(
        () => ({
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
        }),
        []
    )

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setIsLoading(false);
        setHasError(false);
    }

    function onDocumentLoadError(error: Error): void {
        console.error("Error loading PDF:", error);
        setHasError(true);
        setIsLoading(false);
        setErrorMessage(error.message || "Error al cargar el PDF");
        showErrorToast(
            "Error al cargar el PDF",
            "Verifica tu conexión a internet o intenta más tarde"
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header con controles mejorados */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0 gap-3 sm:gap-4">
                        <Link
                            href="/"
                            suppressHydrationWarning
                            onClick={() => {
                                // Salir del fullscreen antes de navegar
                                if (isFullscreen && document.fullscreenElement) {
                                    document.exitFullscreen();
                                }
                            }}
                        >
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Back to Home</span>
                                <span className="sm:hidden">Home</span>
                            </Button>
                        </Link>

                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                            {/* Indicador de progreso */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
                                <span className="text-xs text-muted-foreground">Progress:</span>
                                <span className="text-xs font-medium">{Math.round((pageNumber / numPages) * 100)}%</span>
                            </div>

                            {/* Contador de páginas */}
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap px-2">
                                {pageNumber} / {numPages}
                            </span>

                            {/* Controles de zoom */}
                            <div className="flex items-center gap-1 border rounded-md">
                                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetZoom}
                                    className="min-w-[60px] text-xs"
                                >
                                    {Math.round(scale * 100)}%
                                </Button>
                                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 2.5}>
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Modo de lectura */}
                            <div className="flex items-center gap-1 border rounded-md">
                                <Button
                                    variant={readingMode === "single" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setReadingMode("single")}
                                    title="Single page mode"
                                >
                                    <BookOpen className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={readingMode === "continuous" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setReadingMode("continuous")}
                                    title="Continuous scroll mode"
                                >
                                    <Scroll className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Pantalla completa */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleFullscreen}
                                title="Toggle fullscreen"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button>

                            {/* Atajos de teclado */}
                            <KeyboardShortcutsDialog />

                            {/* Descargar */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={downloadPdf}
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>


            <div
                ref={scrollContainerRef}
                className={`w-full ${readingMode === "continuous"
                    ? "h-screen overflow-y-auto scroll-smooth pt-20 pb-8"
                    : scale > 1.0
                        ? "h-screen overflow-auto pt-20 pb-8"
                        : "h-screen overflow-hidden flex items-center justify-center"
                    } px-4`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div ref={containerRef} className={`flex flex-col items-center gap-4 w-full max-w-6xl mx-auto ${scale > 1.0 ? "py-4" : ""
                    }`}>

                    {/* Estado de Error */}
                    {hasError && (
                        <div className="w-full p-6 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-4 my-4">
                            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-destructive">Error al cargar el PDF</p>
                                <p className="text-sm text-destructive/80">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Indicador de Carga */}
                    {isLoading && !hasError && (
                        <div className="w-full flex items-center justify-center py-8">
                            <div className="flex flex-col items-center gap-4">
                                <Loader className="h-8 w-8 text-primary animate-spin" />
                                <div className="text-center">
                                    <p className="font-semibold text-primary">Cargando PDF...</p>
                                    <p className="text-sm text-muted-foreground mt-1">Por favor espera</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documento PDF */}
                    {!hasError && (
                        <Document
                            file={pdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={
                                <div className="flex items-center justify-center w-full" style={{ height: `${pageHeight}px` }}>
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
                                        <p className="text-muted-foreground text-lg">Loading PDF...</p>
                                        <p className="text-xs text-muted-foreground mt-2">Please wait</p>
                                    </div>
                                </div>
                            }
                            error={
                                <div className="flex items-center justify-center w-full" style={{ height: `${pageHeight}px` }}>
                                    <div className="text-center px-4">
                                        <p className="text-destructive text-lg mb-4 font-semibold">Failed to load PDF</p>
                                        <p className="text-sm text-muted-foreground">Please check your internet connection and try again</p>
                                    </div>
                                </div>
                            }
                            options={documentOptions}
                        >
                            {readingMode === "single" ? (
                                // Modo página única con pre-carga
                                <div className="relative w-full flex justify-center items-center" style={{ height: `${pageHeight}px` }}>
                                    {pagesToRender.map((page) => (
                                        <div
                                            key={page}
                                            className={`transition-opacity duration-300 flex items-center justify-center ${page === pageNumber ? "opacity-100" : "opacity-0 absolute top-0 left-0 right-0 pointer-events-none"
                                                }`}
                                        >
                                            <div
                                                className="border rounded-lg shadow-2xl overflow-hidden bg-white dark:bg-card"
                                                style={{
                                                    width: `${pageWidth}px`,
                                                    height: `${pageHeight}px`,
                                                    maxWidth: '100%'
                                                }}
                                            >
                                                <Page
                                                    pageNumber={page}
                                                    height={pageHeight}
                                                    renderTextLayer={true}
                                                    renderAnnotationLayer={true}
                                                    loading={
                                                        <div className="flex items-center justify-center" style={{ height: `${pageHeight}px`, width: `${pageWidth}px` }}>
                                                            <div className="animate-pulse text-muted-foreground">Loading page...</div>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Modo continuo con scroll infinito
                                <div className="space-y-4 w-full flex flex-col items-center">
                                    {pagesToRender.map((page) => (
                                        <div
                                            key={page}
                                            className="border rounded-lg shadow-lg overflow-hidden bg-white dark:bg-card scroll-mt-20"
                                            style={{ width: `${pageWidth}px`, maxWidth: '100%' }}
                                        >
                                            <Page
                                                pageNumber={page}
                                                height={pageHeight}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={true}
                                                loading={
                                                    <div className="flex items-center justify-center min-h-[400px]">
                                                        <div className="animate-pulse text-muted-foreground">Loading page {page}...</div>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Document>
                    )}

                    {readingMode === "single" && numPages > 0 && (
                        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[90vw] transition-all duration-300">
                            <div className="flex items-center gap-2 sm:gap-3 bg-background/95 backdrop-blur border rounded-full px-3 sm:px-4 py-2 sm:py-3 shadow-2xl">
                                <Button
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={numPages}
                                        value={pageNumber}
                                        onChange={(e) => {
                                            const page = Number.parseInt(e.target.value, 10)
                                            goToPage(page)
                                        }}
                                        className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center border rounded-md bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">/ {numPages}</span>
                                </div>

                                <Button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
