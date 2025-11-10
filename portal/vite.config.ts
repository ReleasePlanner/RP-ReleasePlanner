import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Vendor chunks
          if (
            id.includes("node_modules/@mui/material") ||
            id.includes("node_modules/@emotion")
          ) {
            return "vendor-mui";
          }
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("node_modules/@reduxjs") ||
            id.includes("node_modules/react-redux") ||
            id.includes("node_modules/redux")
          ) {
            return "vendor-redux";
          }
          if (
            id.includes("node_modules/@tanstack") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/react-hook-form")
          ) {
            return "vendor-other";
          }

          // Feature-specific chunks
          if (
            id.includes("src/features/releasePlans/components/Gantt") ||
            id.includes("src/features/releasePlans/components/GanttChart")
          ) {
            return "feature-gantt";
          }
          if (
            id.includes("src/features/releasePlans/components/Plan") ||
            id.includes("src/features/releasePlans/components/PlanCard")
          ) {
            return "feature-plans";
          }

          // Shared utilities and constants
          if (
            id.includes("src/features/releasePlans/lib") ||
            id.includes("src/features/releasePlans/utils") ||
            id.includes("src/constants")
          ) {
            return "utils-shared";
          }
        },
      },
    },
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 750,
  },
});
