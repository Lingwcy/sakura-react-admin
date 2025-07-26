import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@apis": path.resolve(__dirname, './src/apis'),
      "@pages": path.resolve(__dirname, './src/pages'),
      "@router": path.resolve(__dirname, './src/router'),
      "@store": path.resolve(__dirname, './src/store'),
      "@utils": path.resolve(__dirname, './src/utils')
    }
  }
})
