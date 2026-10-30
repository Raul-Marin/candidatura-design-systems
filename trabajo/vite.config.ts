import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { workspacePlugin } from './plugin/workspace.ts'

export default defineConfig({
  plugins: [workspacePlugin(), react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 4740,
    strictPort: true,
    watch: {
      ignored: ['**/data/**'],
    },
  },
})
