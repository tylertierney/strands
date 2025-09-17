import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 5_000_000,
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Strands',
        short_name: 'Strands',
        display: 'fullscreen',
        description: 'A word search with a twist',
        background_color: '#1f232e',
        icons: [
          {
            src: '/strands-dark.svg',
            sizes:
              '48x48 72x72 96x96 120x120 128x128 144x144 180x180 256x256 512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/strands-dark.svg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        theme_color: '#1f232e',
      },
    }),
  ],
  server: {
    host: '192.168.254.167',
    port: 3000,
  },
})
