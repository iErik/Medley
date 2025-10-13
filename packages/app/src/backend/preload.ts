import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ElectronIPC', {
  platform: () => process.platform,
})
