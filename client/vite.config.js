import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const sharedDir = fileURLToPath(new URL('../shared', import.meta.url))

export default defineConfig({
  plugins: [react()],
  // Content schema/defaults shared with the API server (../shared).
  resolve: {
    alias: { '@shared': sharedDir }
  },
  // maplibre-gl ships its own web worker; Vite's dep optimizer doesn't
  // bundle that worker alongside the pre-bundled deps cache, which breaks
  // it in dev. Excluding it here keeps the package (and its worker) intact.
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  server: {
    port: 5173,
    fs: { allow: ['.', sharedDir] },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      // Photos uploaded through the CMS are stored and served by the API server.
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
