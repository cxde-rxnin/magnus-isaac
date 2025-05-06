import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://port-server-phi.vercel.app/api', // Change this to your actual backend URL/port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})