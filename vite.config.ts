import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@apis": path.resolve(__dirname, './src/apis'),
      "@pages": path.resolve(__dirname, './src/pages'),
      "@router": path.resolve(__dirname, './src/router'),
      "@store": path.resolve(__dirname, './src/store'),
      "@utils": path.resolve(__dirname, './src/utils'),
      "@types": path.resolve(__dirname, './src/types'),
      "@hooks": path.resolve(__dirname, './src/hooks')
    }
    
  },
  css:{
    modules:{
      localsConvention:'camelCase'
    }
  }
})
