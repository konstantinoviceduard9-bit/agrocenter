import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function normalizeBase(path: string | undefined): string {
  if (!path || path === '/') return '/'
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return withSlash.startsWith('/') ? withSlash : `/${withSlash}`
}

// GitHub Pages: VITE_BASE_PATH=/<repo>/matrix/ (см. deploy-github-pages.yml)
const base = normalizeBase(process.env.VITE_BASE_PATH)

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('recharts') || id.includes('d3-')) return 'recharts'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },
})
