import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { builtinModules } from 'module'
import { defineConfig, Plugin, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import resolve from 'vite-plugin-resolve'
import svgr from 'vite-plugin-svgr'

import pkg from '../../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = Object.entries(
    loadEnv(mode, process.cwd(), 'VIT_') || {}
  ).reduce((acc, [ key, val ]) => ({
      ...acc,
      [key.replace('VIT_', '')]: val
    }), {})

  return {
    mode: process.env.NODE_ENV,
    root: __dirname,
    plugins: [
      react(),
      svgr()
    ],
    base: './',
    build: {
      emptyOutDir: true,
      outDir: '../../dist/renderer'
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
        '@pkg': join(__dirname, '../../'),
        '@root': join(__dirname, '../../src'),
        '@hooks': join(__dirname, 'src/hooks'),
        '@parser': join(__dirname, 'src/parser'),
        '@components': join(__dirname, 'src/components'),
        '@containers': join(__dirname, 'src/containers'),
        '@store': join(__dirname, 'src/store'),
        '@styles': join(__dirname, 'src/styles'),
        '@static': join(__dirname, 'src/static'),
        '@utils': join(__dirname, 'src/utils'),
        '@modules': join(__dirname, 'src/modules'),
        '@views': join(__dirname, 'src/views'),
      }
    },
    server: {
      host: pkg.env.HOST,
      port: pkg.env.PORT
    },
    define: { __APP_ENV__: env }
  }
})

// I have no idea what this does
export function resolveElectron (resolves: Parameters<typeof resolve>[0] = {}): Plugin {
  const builtIns = builtinModules.filter(t => !t.startsWith('_'))

  const electronExport = () =>
    `
    /**
     * All exports module see https://www.electronjs.org -> API -> Renderer Process Modules
     */
    const electron = require("electron");
    const {
      clipboard,
      nativeImage,
      shell,
      contextBridge,
      crashReporter,
      ipcRenderer,
      webFrame,
      desktopCapturer,
      deprecate,
    } = electron;

    export {
      electron as default,
      clipboard,
      nativeImage,
      shell,
      contextBridge,
      crashReporter,
      ipcRenderer,
      webFrame,
      desktopCapturer,
      deprecate,
    }
    `

  const builtinModulesExport = (modules: string[]) => modules
    .map(moduleId => {
      const nodeModule = require(moduleId)
      const requireModule = `const M = require("${moduleId}");`
      const exportDefault = `export default M;`
      const exportMembers = Object.keys(nodeModule)
        .map(attr => `export const ${attr} = M.${attr}`).join(';\n') + 'l'
      const nodeModuleCode = `
        ${requireModule}
        ${exportDefault}
        ${exportMembers}
      `

      return { [moduleId]: nodeModuleCode }
    })
    .reduce((memo, item) => Object.assign(memo, item), {})

  return resolve({
    electron: electronExport(),
    ...builtinModulesExport(builtIns),
    ...resolves
  })

}
