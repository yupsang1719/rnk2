import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // maplibre-gl ships its own web worker; Vite's dep optimizer doesn't
  // bundle that worker alongside the pre-bundled deps cache, which breaks
  // it in dev. Excluding it here keeps the package (and its worker) intact.
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
