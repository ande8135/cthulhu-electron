import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";

// Build both renderer (Vite) and Electron (main/preload) with one config.
export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' : './',
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: {
          preload: "electron/preload.ts",
        },
      },
      // enable reload during dev
      // (vite-plugin-electron handles launching electron for you)
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: '/index.html',
      },
    },
  },
});