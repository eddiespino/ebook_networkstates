"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type ReadingMode = "single" | "continuous";

interface UsePDFReaderOptions {
  initialPage?: number;
  initialScale?: number;
  initialMode?: ReadingMode;
  storageKey?: string;
}

interface UsePDFReaderReturn {
  numPages: number;
  pageNumber: number;
  scale: number;
  readingMode: ReadingMode;
  isFullscreen: boolean;
  pageWidth: number;
  pageHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  setNumPages: (num: number) => void;
  setPageNumber: (page: number | ((prev: number) => number)) => void;
  setScale: (scale: number | ((prev: number) => number)) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleFullscreen: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  pagesToRender: number[];
}

export function usePDFReader({
  initialPage = 1,
  initialScale = 1.0,
  initialMode = "single",
  storageKey = "pdf-reader",
}: UsePDFReaderOptions = {}): UsePDFReaderReturn {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(initialScale);
  const [readingMode, setReadingMode] = useState<ReadingMode>(initialMode);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Cargar estado guardado
  useEffect(() => {
    const savedPage = localStorage.getItem(`${storageKey}-page`);
    const savedMode = localStorage.getItem(`${storageKey}-mode`);
    const savedScale = localStorage.getItem(`${storageKey}-scale`);

    if (savedPage !== null) {
      const page = Number.parseInt(savedPage, 10);
      if (!Number.isNaN(page)) setPageNumber(page);
    }
    if (savedMode === "single" || savedMode === "continuous") {
      setReadingMode(savedMode);
    }
    if (savedScale !== null) {
      const parsedScale = Number.parseFloat(savedScale);
      if (!Number.isNaN(parsedScale)) setScale(parsedScale);
    }
  }, [storageKey]);

  // Guardar progreso
  useEffect(() => {
    if (numPages > 0) {
      localStorage.setItem(`${storageKey}-page`, pageNumber.toString());
    }
  }, [pageNumber, numPages, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-mode`, readingMode);
  }, [readingMode, storageKey]);

  useEffect(() => {
    localStorage.setItem(`${storageKey}-scale`, scale.toString());
  }, [scale, storageKey]);

  // Prevenir scroll del body para evitar múltiples scrollbars
  useEffect(() => {
    // Guardar el valor original
    const originalOverflow = document.body.style.overflow;

    // Establecer overflow hidden en el body
    document.body.style.overflow = "hidden";

    // Restaurar al desmontar
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Calcular ancho y alto óptimo basado en zoom
  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current !== null) {
        const containerWidth = containerRef.current.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Header del PDF siempre está presente (80px desktop, 100px móvil)
        const headerHeight = viewportWidth < 640 ? 100 : 80;
        // En fullscreen ocultamos footer (no header), así que hay más espacio
        const bottomMarginPercent = isFullscreen ? 0.05 : 0.2;
        const bottomMargin = viewportHeight * bottomMarginPercent;

        // Margen superior e inferior para centrar
        // Cuando hay zoom (scale > 1.0), agregamos padding-top de 80px (pt-20) para safe area
        const safeAreaTop = scale > 1.0 ? 80 : 0;
        const safeAreaBottom = scale > 1.0 ? 32 : 0; // pb-8 = 32px
        const verticalPadding = isFullscreen ? 20 : 40;
        const availableHeight =
          viewportHeight -
          headerHeight -
          bottomMargin -
          verticalPadding -
          safeAreaTop -
          safeAreaBottom;

        // Calcular alto óptimo basado en el viewport disponible
        // Asegurar un mínimo razonable según el dispositivo
        const minHeight = viewportWidth < 640 ? 300 : 400;
        const baseHeight = Math.max(availableHeight, minHeight);

        // Calcular ancho basado en la relación de aspecto de una página típica de PDF (8.5:11 = 0.773)
        // Esto mantiene el contenido del PDF sin distorsión
        const aspectRatio = 8.5 / 11; // Relación de aspecto estándar de página US Letter
        const baseWidth = baseHeight * aspectRatio;

        // Aplicar el zoom a las dimensiones base
        // El zoom multiplica tanto el ancho como el alto manteniendo la relación de aspecto
        let finalWidth = baseWidth * scale;
        let finalHeight = baseHeight * scale;

        // Limitar el ancho al espacio disponible del contenedor (solo si no hay scroll)
        const maxAvailableWidth = Math.min(
          containerWidth - 40,
          viewportWidth - 40
        );

        // Si el zoom es 1.0 (normal), limitar al espacio disponible
        // Si el zoom es > 1.0, permitir que se expanda (con scroll)
        if (scale <= 1.0) {
          const optimalWidth = Math.min(finalWidth, maxAvailableWidth);

          if (optimalWidth < finalWidth) {
            // El ancho está limitado, ajustar altura proporcionalmente
            finalHeight = optimalWidth / aspectRatio;
            finalWidth = optimalWidth;
          }
        }

        setPageWidth(finalWidth);
        setPageHeight(finalHeight);
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current !== null) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, [scale, isFullscreen]); // Recalcular al hacer zoom o cambiar fullscreen

  // Scroll suave al cambiar de página
  useEffect(() => {
    if (readingMode === "single" && scrollContainerRef.current !== null) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pageNumber, readingMode]);

  // Detección de página visible en modo continuo
  useEffect(() => {
    if (readingMode !== "continuous" || scrollContainerRef.current === null)
      return;

    const container = scrollContainerRef.current;
    let ticking = false;

    const handleScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const containerHeight = container.clientHeight;
          const scrollHeight = container.scrollHeight;

          // Calcular página actual basada en el centro de la vista
          const centerPosition = scrollTop + containerHeight / 2;
          const pageHeight = scrollHeight / numPages;
          const currentPage = Math.floor(centerPosition / pageHeight) + 1;

          if (
            currentPage !== pageNumber &&
            currentPage >= 1 &&
            currentPage <= numPages
          ) {
            setPageNumber(currentPage);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [readingMode, numPages, pageNumber]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // No interceptar si el usuario está escribiendo en un input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (readingMode === "continuous") return;

      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goToPrevPage();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          goToNextPage();
          break;
        case "Home":
          e.preventDefault();
          setPageNumber(1);
          break;
        case "End":
          e.preventDefault();
          setPageNumber(numPages);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [readingMode, numPages]);

  // Funciones de navegación
  const goToPrevPage = useCallback((): void => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback((): void => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }, [numPages]);

  const goToPage = useCallback(
    (page: number): void => {
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);

        if (
          readingMode === "continuous" &&
          scrollContainerRef.current !== null
        ) {
          const container = scrollContainerRef.current;
          const pageHeight = container.scrollHeight / numPages;
          container.scrollTo({
            top: (page - 1) * pageHeight,
            behavior: "smooth",
          });
        }
      }
    },
    [numPages, readingMode]
  );

  // Funciones de zoom
  const zoomIn = useCallback((): void => {
    setScale((s) => Math.min(s + 0.1, 2.5));
  }, []);

  const zoomOut = useCallback((): void => {
    setScale((s) => Math.max(s - 0.1, 0.5));
  }, []);

  const resetZoom = useCallback((): void => {
    setScale(1.0);
  }, []);

  // Pantalla completa
  const toggleFullscreen = useCallback((): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Gestos táctiles
  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      if (readingMode === "continuous") return;
      touchStartX.current = e.touches[0]?.clientX ?? 0;
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    },
    [readingMode]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent): void => {
      if (readingMode === "continuous") return;

      const touchEndX = e.changedTouches[0]?.clientX ?? 0;
      const touchEndY = e.changedTouches[0]?.clientY ?? 0;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Solo si el swipe es más horizontal que vertical y suficientemente largo
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          goToPrevPage();
        } else {
          goToNextPage();
        }
      }
    },
    [readingMode, goToPrevPage, goToNextPage]
  );

  // Pre-cargar páginas adyacentes
  const pagesToRender =
    readingMode === "single"
      ? [pageNumber - 1, pageNumber, pageNumber + 1].filter(
          (p) => p >= 1 && p <= numPages
        )
      : Array.from({ length: numPages }, (_, i) => i + 1);

  return {
    numPages,
    pageNumber,
    scale,
    readingMode,
    isFullscreen,
    pageWidth,
    pageHeight,
    containerRef,
    scrollContainerRef,
    setNumPages,
    setPageNumber,
    setScale,
    setReadingMode,
    setIsFullscreen,
    goToPrevPage,
    goToNextPage,
    goToPage,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleFullscreen,
    handleTouchStart,
    handleTouchEnd,
    pagesToRender,
  };
}
