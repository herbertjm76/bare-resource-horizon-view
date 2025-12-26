
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent "Invalid hook call" by ensuring a single React instance
    dedupe: ["react", "react-dom"],
  },
  // Add clear error handling for dependency issues
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  // Configure file watching to prevent EMFILE errors
  define: {
    global: 'globalThis',
  }
}));
