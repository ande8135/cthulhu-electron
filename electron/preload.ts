import { contextBridge } from "electron";

// Expose a tiny, typed API to the renderer (no Node.js exposure)
contextBridge.exposeInMainWorld("api", {
  ping: async () => "pong2"
});

export type PreloadApi = {
  ping: () => Promise<string>;
};

declare global {
  interface Window {
    api: PreloadApi;
  }
}