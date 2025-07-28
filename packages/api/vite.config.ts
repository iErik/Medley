import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import dts from 'unplugin-dts/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(() => ({
  root: __dirname,
  plugins: [ dts({
    bundleTypes: true,
    tsconfigPath: './tsconfig.json'
  }) ],
  base: './',
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '@root': join(__dirname, './'),
      '@mappers': join(__dirname, 'src/mappers'),
      '@typings': join(__dirname, './typings'),
      '@delta': join(__dirname, 'src/delta'),
      '@bonfire': join(__dirname, 'src/bonfire'),
      '@utils': join(__dirname, 'src/utils'),
    }
  },
  build: {
    outDir: join(__dirname, './lib'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'revolt',
      formats: [ "es" ],
      fileName: 'revolt',
    },

    rollupOptions: {
      external: [],
      output: { globals: {} }
    }
  }
}))

