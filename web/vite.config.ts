import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function normalizeBase(path: string | undefined): string {
  if (!path || path === '/') return '/'
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return withSlash.startsWith('/') ? withSlash : `/${withSlash}`
}

// GitHub Pages: VITE_BASE_PATH=/имя-репозитория/ (см. .github/workflows/deploy-github-pages.yml)
const base = normalizeBase(process.env.VITE_BASE_PATH)

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
