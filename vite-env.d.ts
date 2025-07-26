/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_LOG_ENDPOINT: string
  readonly VITE_LOG_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
