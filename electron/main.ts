import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import isDev from "electron-is-dev";

let win: BrowserWindow | null = null;

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1100,
    height: 720,
    title: "Electron React TS",
    webPreferences: {
      // security best practices:
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true
    }
  });

  // Set CSP headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          isDev
            ? "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "img-src 'self' data: https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173; " +
              "connect-src 'self' http://localhost:5173 ws://localhost:5173; " +
              "worker-src 'self' blob:;"
            : "default-src 'self'; " +
              "img-src 'self' data: https:; " +
              "style-src 'self' 'unsafe-inline'; " +
              "script-src 'self'; " +
              "connect-src 'self'; " +
              "worker-src 'self' blob:;"
        ]
      }
    });
  });

  if (isDev) {
    await win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    // Load built index.html
    await win.loadFile(path.join(__dirname, "../index.html"));
  }

  // Open external links in default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("closed", () => (win = null));
};

app.whenReady().then(createWindow);

// macOS: re-create window on dock icon click when no windows are open
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  // On macOS, apps commonly stay active until Cmd+Q
  if (process.platform !== "darwin") app.quit();
});