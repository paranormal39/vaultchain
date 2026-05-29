import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          rxjs:  ['rxjs'],
          xrpl:  ['xrpl'],
        }
      }
    }
  },

  server: {
    port: parseInt(process.env.VITE_FRONTEND_PORT || '5173', 10),
    proxy: {
      '/api/mcp': {
        target: process.env.VITE_MCP_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mcp/, '')
      },
      '/api/matthew': {
        target: process.env.VITE_MATTHEW_URL || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/matthew/, '')
      },
      '/api/xara': {
        target: process.env.VITE_XARA_URL || 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/xara/, '')
      },
      '/api/ada': {
        target: process.env.VITE_ADA_URL || 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ada/, '')
      }
    }
  },

  preview: {
    port: parseInt(process.env.VITE_FRONTEND_PORT || '5173', 10),
  }
}))
