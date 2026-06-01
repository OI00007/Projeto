import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@supabase/supabase-js")) {
            return "vendor-supabase";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/zod") ||
            id.includes("node_modules/@hookform/resolvers")
          ) {
            return "vendor-forms";
          }
          if (id.includes("node_modules/jspdf")) {
            return "vendor-pdf";
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    target: "esnext",
    minify: "esbuild",
  },
});

// já declarado — apenas confirmando que Reports usa chunk separado automaticamente pelo lazy()
