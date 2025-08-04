import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        
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
    build: {
        rollupOptions: {

        },
        assetsInlineLimit: 4096, // 4kb
        outDir: "build",
        emptyOutDir: true
    }

})


