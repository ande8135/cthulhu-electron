import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import path from "node:path";
import isDev from "electron-is-dev";
import fs from "node:fs/promises";
import { createApplicationMenu } from "./menu";

// Disable hardware acceleration to prevent GPU-related errors
// Only disable hardware acceleration if there are GPU issues
if (process.platform === 'linux') {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
}

// Disable autofill to prevent unnecessary overhead
app.commandLine.appendSwitch('disable-features', 'Autofill');

const MAX_RECENT_FILES = 5;

// Store recent files in app.getPath('userData')
const getRecentFilesPath = () => path.join(app.getPath('userData'), 'recent-files.json');

async function loadRecentFiles(): Promise<string[]> {
  try {
    const content = await fs.readFile(getRecentFilesPath(), 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveRecentFiles(files: string[]) {
  await fs.writeFile(getRecentFilesPath(), JSON.stringify(files));
}

async function addRecentFile(filePath: string) {
  const recentFiles = await loadRecentFiles();
  const newRecent = [filePath, ...recentFiles.filter(f => f !== filePath)]
    .slice(0, MAX_RECENT_FILES);
  await saveRecentFiles(newRecent);
  return newRecent;
}

let win: BrowserWindow | null = null;

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Call of Cthulhu Character Editor",
    backgroundColor: '#f7f3e3', // Match the app background color
    // Use the default OS title bar
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

  // Create the application menu
  createApplicationMenu(win);
};

app.whenReady().then(createWindow);

// macOS: re-create window on dock icon click when no windows are open
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// File operation handlers
ipcMain.handle('dialog:showSave', async () => {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  return result.filePath;
});

ipcMain.handle('dialog:showOpen', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  return result.filePaths[0];
});

ipcMain.handle('file:save', async (_, filePath, characterData) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(characterData, null, 2));
    await addRecentFile(filePath);
    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('file:load', async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    await addRecentFile(filePath);
    return { success: true, data: JSON.parse(content) };
  } catch (error) {
    console.error('Error loading file:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('character:getData', async (event) => {
  // Request character data from renderer
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) {
    return { success: false, error: 'Window not available' };
  }
  
  try {
    const data = await win.webContents.executeJavaScript(`
      (function() {
        if (window.formikRef && window.formikRef.current) {
          return window.formikRef.current.values;
        }
        return null;
      })()
    `);
    
    if (data) {
      return { success: true, data };
    } else {
      return { success: false, error: 'No form data available' };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('recent:get', async () => {
  return await loadRecentFiles();
});

ipcMain.handle('recent:add', async (_, filePath) => {
  return await addRecentFile(filePath);
});

ipcMain.handle('window:new', () => {
  createWindow();
});

app.on("window-all-closed", () => {
  // On macOS, apps commonly stay active until Cmd+Q
  if (process.platform !== "darwin") app.quit();
});

// Allow renderer to set the window title dynamically
ipcMain.handle('window:setTitle', (event, title: string) => {
  const senderWin = BrowserWindow.fromWebContents(event.sender);
  if (senderWin && !senderWin.isDestroyed()) {
    senderWin.setTitle(title);
  }
});