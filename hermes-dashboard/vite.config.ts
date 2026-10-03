import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3100,
    proxy: {
      '/api/hermes': {
        target: 'http://127.0.0.1:8642',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hermes/, ''),
      },
      '/api/router': {
        target: 'http://127.0.0.1:20128',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/router/, ''),
      },
    },
  },
})
