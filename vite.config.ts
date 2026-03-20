import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
       // Everything not starting with /assets or /src etc needs to be proxied?
       // The API routes are: /auth, /library, /favorites, /playlists, /media, /coordinates, /health
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/library": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/favorites": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/playlists": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/media": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/coordinates": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Three.js and related (only loaded on /visualize)
          "vendor-three": [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
          ],
          // UI component libraries
          "vendor-ui": [
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "lucide-react",
          ],
        },
      },
    },
  },
});
