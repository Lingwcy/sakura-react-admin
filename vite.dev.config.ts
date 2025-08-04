import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'
import tailwindcss from '@tailwindcss/vite'
const logger = createLogger()
const loggerWarn = logger.warn
const loggerInfo = logger.info
const loggerError = logger.error
logger.warn = (msg, options) => {
    msg = formatLog(msg, "[警告]")
    loggerWarn(msg, options)
}

logger.info = (msg, options) => {
    msg = formatLog(msg, "[信息]")
    loggerInfo(msg, options)
}

logger.error = (msg, options) => {
    msg = formatLog(msg, "[错误]")
    loggerError(msg, options)
}

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        viteMockServe({
            mockPath: 'mock',
            enable: true,
            watchFiles: true,
            logger: true,
        }),
    ],
    base: './',
    root: "./",
    mode: "development",
    logLevel: 'info',
    customLogger: logger,
    server: {
        port: 5173,
        strictPort: false,
    },
})


function formatLog(msg: string, prefix: string = "[Meow]") {
    return `${prefix} ${msg}`;
}

