import { Menu, app, BrowserWindow, dialog } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

export function createApplicationMenu(win: BrowserWindow) {
  const isMac = process.platform === 'darwin';

  const handleNew = () => {
    createWindow();
  };

  const handleOpen = async () => {
    try {
      const result = await dialog.showOpenDialog(win, {
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        try {
          const data = await fs.readFile(result.filePaths[0], 'utf-8');
          const jsonData = JSON.parse(data);
          
          // Update the form in the renderer
          await win.webContents.executeJavaScript(`
            if (window.formikRef && window.formikRef.current) {
              window.formikRef.current.resetForm({ 
                values: { 
                  ...${JSON.stringify(jsonData)}, 
                  filePath: '${result.filePaths[0]}' 
                } 
              });
            }
          `);
        } catch (err) {
          console.error('Error loading data:', err);
          dialog.showErrorBox('Load Error', 'Failed to load character data');
        }
      }
    } catch (error) {
      console.error('Error in open dialog:', error);
      dialog.showErrorBox('Error', 'Failed to open file dialog');
    }
  };

  const handleSave = async () => {
    try {
      const result = await dialog.showSaveDialog(win, {
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });

      if (!result.canceled && result.filePath) {
        try {
          // Get the form data from the renderer
          const formDataJson = await win.webContents.executeJavaScript(`(function(){
            try {
              if (window.formikRef && window.formikRef.current) {
                return JSON.stringify(window.formikRef.current.values || null);
              }
            } catch (e) {
              return null;
            }
            return null;
          })()`);

          if (formDataJson) {
            const formData = JSON.parse(formDataJson);
            // ensure bonusSkillPoints is present (default to 0)
            if (typeof formData.bonusSkillPoints === 'undefined') formData.bonusSkillPoints = 0;
            await fs.writeFile(result.filePath, JSON.stringify(formData, null, 2));
            await win.webContents.executeJavaScript(`
              if (window.formikRef && window.formikRef.current) {
                window.formikRef.current.setFieldValue('filePath', '${result.filePath}');
              }
            `);
          } else {
            throw new Error('No form data available');
          }
        } catch (err) {
          console.error('Error saving data:', err);
          dialog.showErrorBox('Save Error', 'Failed to save character data');
        }
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