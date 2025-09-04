import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteMockServe({
            mockPath: 'mock',
            // 生产环境启用 mock
            enable: true,
        }),
        viteCompression({
            threshold: 1024 * 10, // 仅压缩大于 10KB 的文件
        }),
        visualizer({
            filename: 'build/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
        })
    ],
    build: {
        rollupOptions: {

        },
        assetsInlineLimit: 4096, // 4kb
        outDir: "build",
        emptyOutDir: true
    }
})


