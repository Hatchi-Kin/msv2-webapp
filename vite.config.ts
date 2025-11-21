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
