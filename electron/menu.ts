import { Menu, app, BrowserWindow, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

export function createApplicationMenu(win: BrowserWindow) {
  const isMac = process.platform === 'darwin';

  const handleNew = () => {
    createWindow();
  };

  const handleOpen = async () => {
    if (!win || win.isDestroyed()) {
      dialog.showErrorBox('Error', 'Window is not available');
      return;
    }

    try {
      const result = await dialog.showOpenDialog(win, {
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        
        // Send message to renderer to load the file
        win.webContents.send('file:load', filePath);
      }
    } catch (error) {
      console.error('Error in open dialog:', error);
      dialog.showErrorBox('Error', 'Failed to open file dialog');
    }
  };

  const handleSave = async () => {
    if (!win || win.isDestroyed()) {
      dialog.showErrorBox('Error', 'Window is not available');
      return;
    }

    try {
      const result = await dialog.showSaveDialog(win, {
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });

      if (!result.canceled && result.filePath) {
        // Send message to renderer to save the file
        win.webContents.send('file:save', result.filePath);
      }
    } catch (error) {
      console.error('Error in save dialog:', error);
      dialog.showErrorBox('Error', 'Failed to open save dialog');
    }
  };

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Character',
          accelerator: 'CmdOrCtrl+N',
          click: handleNew
        },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: handleOpen
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: handleSave
        },
        {
          label: 'Save As...',
          accelerator: 'Shift+CmdOrCtrl+S',
          click: handleSave
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../index.html'));
  }

  return win;
}