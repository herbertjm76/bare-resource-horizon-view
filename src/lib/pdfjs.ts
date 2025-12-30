// Centralized PDF.js worker configuration for Vite
// Ensures pdfjs-dist can spawn its worker reliably in dev + production.

import { GlobalWorkerOptions } from "pdfjs-dist";

let workerConfigured = false;

export function ensurePdfJsWorker() {
  if (workerConfigured) return;

  // Vite-friendly worker URL (bundled as an asset)
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  workerConfigured = true;
}
