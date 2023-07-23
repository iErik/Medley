/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BONFIRE_API: string
  readonly VITE_DELTA_API: string
  readonly VITE_AUTUMN_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
