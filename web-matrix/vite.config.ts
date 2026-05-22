import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

function normalizeBase(path: string | undefined): string {
  if (!path || path === '/') return '/'
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return withSlash.startsWith('/') ? withSlash : `/${withSlash}`
}

// GitHub Pages: VITE_BASE_PATH=/<repo>/matrix/ (см. deploy-github-pages.yml)
const base = normalizeBase(process.env.VITE_BASE_PATH)

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        id: 'neral-matrix-farm',
        name: 'Нерал-Матрикс',
        short_name: 'Матрикс',
        description: 'Пульт фермы: дойка, стадо, кормление, задачи сотрудников',
        theme_color: '#1e40af',
        background_color: '#e8eaed',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'ru',
        start_url: './login',
        scope: './',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
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
