import fs from 'fs'
import {
  shell,
  contextBridge,
  ipcRenderer,
} from 'electron'

// Exposes some Node API to Renderer process.
contextBridge.exposeInMainWorld('fs', fs)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('shell', withPrototype(shell))

function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native API not work in Renderer-process, like `NodeJS.EventEmitter['on']`. Wrap a function patch it.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }

  return obj
}
