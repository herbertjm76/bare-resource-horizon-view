import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, Loader2 } from "lucide-react";

import { GlobalWorkerOptions, getDocument, PDFDocumentProxy } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function PdfViewer({ url, className, isFullscreen, onToggleFullscreen }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Load the PDF document
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setStatus("loading");
      try {
        // Fetch the PDF as an ArrayBuffer to avoid CORS issues with pdfjs
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        
        const loadingTask = getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        if (!cancelled) {
          setPdf(pdfDoc);
          setTotalPages(pdfDoc.numPages);
          setCurrentPage(1);
        }
      } catch (e) {
        console.error("PDF load error:", e);
        if (!cancelled) setStatus("error");
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current || !containerRef.current) return;

    setStatus("loading");
    try {
      const page = await pdf.getPage(currentPage);
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("No canvas context");

      // Calculate scale to fit container width while respecting zoom
      const containerWidth = Math.max(container.clientWidth - 32, 1); // padding
      const containerHeight = Math.max(container.clientHeight - 80, 1); // controls + padding

      // If the dialog/container hasn't measured yet, defer rendering
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        requestAnimationFrame(() => {
          // Avoid throwing if unmounted
          if (containerRef.current) renderPage();
        });
        return;
      }

      const unscaledViewport = page.getViewport({ scale: 1 });

      const widthScale = containerWidth / unscaledViewport.width;
      const heightScale = containerHeight / unscaledViewport.height;
      const fitScale = Math.min(widthScale, heightScale, 2); // cap at 2x

      const viewport = page.getViewport({ scale: fitScale * scale });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: context, viewport, canvas }).promise;
      setStatus("ready");
    } catch (e) {
      console.error("PDF render error:", e);
      setStatus("error");
    }
  }, [pdf, currentPage, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Re-render on container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      renderPage();
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [renderPage]);

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const zoomIn = () => {
    setScale((s) => Math.min(s + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((s) => Math.max(s - 0.25, 0.5));
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col bg-muted/50 rounded-lg overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToPrev}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {currentPage} / {totalPages || "..."}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToNext}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={scale >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        {status === "error" ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Failed to load PDF
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={cn(
                "shadow-lg rounded bg-white transition-opacity",
                status === "loading" && "opacity-50"
              )}
            />
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
