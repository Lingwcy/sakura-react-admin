import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteMockServe({
            mockPath: 'mock',
            // 生产环境启用 mock
            enable: true,
        }),


    ],

})


