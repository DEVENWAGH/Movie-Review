import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    chunkSizeWarningLimit: 700, // Increase from default 500
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          // Add more manual chunks as needed
        },
      },
    },
  },
});