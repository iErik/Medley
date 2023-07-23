import { ipcMain, BrowserWindow } from 'electron'

ipcMain.handle('discord-auth', (event, authUrl) => {
  let authWindow = new BrowserWindow({
    width: 875,
    height: 600
  })

  authWindow.loadURL(authUrl)

  authWindow.on('ready-to-show', () => authWindow.show());

  authWindow.webContents.on('will-navigate', (ev, newUrl) => {
  });
})
