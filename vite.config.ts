import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/musics-2",
  plugins: [react()],
  envDir: "environments",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src/"),

      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
