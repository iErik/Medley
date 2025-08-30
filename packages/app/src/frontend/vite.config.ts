import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from '../../package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    react(),
    svgr(),
    tsconfigPaths()
  ],
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/renderer'
  },
  resolve: {
    alias: {
      '@': join(__dirname, '.'),
      '@pkg': join(__dirname, '../../'),
      '@src': join(__dirname, '../../src'),
      '@hooks': join(__dirname, 'hooks'),
      '@parser': join(__dirname, 'parser'),
      '@components': join(__dirname, 'components'),
      '@containers': join(__dirname, 'containers'),
      '@store': join(__dirname, 'store'),
      '@styles': join(__dirname, 'styles'),
      '@static': join(__dirname, 'static'),
      '@utils': join(__dirname, 'utils'),
      '@modules': join(__dirname, 'modules'),
      '@views': join(__dirname, 'views'),
      '@pages': join(__dirname, 'pages'),
      '@layouts': join(__dirname, 'layouts'),
      '@stitched': join(__dirname, 'stitched'),
      '@middlewares': join(__dirname, 'middlewares'),
    }
  },
  server: {
    host: pkg.env.HOST,
    port: pkg.env.PORT
  }
})
