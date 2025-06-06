// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      manifest: {
        name: 'Kindergarten Management',
        short_name: 'Kindergarten',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        /* ① 페이지 탐색 요청은 index.html 로 폴백 */
        navigateFallback: '/index.html',

        /* ② 하지만 uploads·api 경로는 SW가 건드리지 않도록 제외 */
        navigateFallbackDenylist: [
          /^\/uploads\//,   // 업로드 이미지
          /^\/api\//        // 백엔드 API
        ],

        /* ③ 나머지 런타임 캐싱 전략 (원래 있던 부분) */
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages-cache' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@':         fileURLToPath(new URL('./src', import.meta.url)),
      '@assets':   fileURLToPath(new URL('./src/shared/assets', import.meta.url)),
      '@shared':   fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@ui':       fileURLToPath(new URL('./src/shared/ui', import.meta.url)),
      '@utils':    fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@pages':    fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@types':    fileURLToPath(new URL('./src/types', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@routes':   fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@app':      fileURLToPath(new URL('./src/app', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target:       'http://localhost:8080',
        changeOrigin: true,
        secure:       false,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
