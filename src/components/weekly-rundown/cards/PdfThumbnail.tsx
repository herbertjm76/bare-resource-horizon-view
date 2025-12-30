import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// PDF.js
import { getDocument } from "pdfjs-dist";
import { ensurePdfJsWorker } from "@/lib/pdfjs";

ensurePdfJsWorker();

type PdfThumbnailProps = {
  url: string;
  className?: string;
  /** Higher = sharper; keep modest for performance. */
  scale?: number;
};

export function PdfThumbnail({ url, className, scale = 1.2 }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  // Prevent cache issues across uploads by forcing a stable cache-buster (object/embed sometimes caches aggressively).
  const urlWithBust = useMemo(() => {
    const hasQuery = url.includes("?");
    return `${url}${hasQuery ? "&" : "?"}v=${encodeURIComponent(String(Math.floor(Date.now() / 60000)))}`;
  }, [url]);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      setStatus("loading");

      try {
        const loadingTask = getDocument({ url: urlWithBust, withCredentials: false });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale });
        const context = canvas.getContext("2d");
        if (!context) throw new Error("No canvas context");

        // Fit to canvas size.
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvas, canvasContext: context, viewport }).promise;

        if (!cancelled) setStatus("ready");
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [scale, urlWithBust]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "h-full w-full",
          // cover
          "[object-fit:cover]",
          // smoothing
          "[image-rendering:auto]"
        )}
      />

      {status !== "ready" && (
        <div className="absolute inset-0 grid place-items-center bg-muted">
          <div className="text-xs text-muted-foreground">
            {status === "error" ? "Preview unavailable" : "Loading preview…"}
          </div>
        </div>
      )}
    </div>
  );
}
