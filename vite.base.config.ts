import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
const rootDir = import.meta.dirname
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        
    ],
    resolve: {
        alias: {
            "@": path.resolve(rootDir, "./src"),
            "@assets": path.resolve(rootDir, "./src/assets"),
            "@apis": path.resolve(rootDir, './src/apis'),
            "@pages": path.resolve(rootDir, './src/pages'),
            "@router": path.resolve(rootDir, './src/router'),
            "@store": path.resolve(rootDir, './src/store'),
            "@utils": path.resolve(rootDir, './src/utils'),
            "@types": path.resolve(rootDir, './src/types'),
            "@hooks": path.resolve(rootDir, './src/hooks')
        }

    },

})

