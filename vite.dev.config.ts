import { createLogger, defineConfig } from "vite";

const logger = createLogger();
const loggerWarn = logger.warn;
const loggerInfo = logger.info;
const loggerError = logger.error;

logger.warn = (message, options) => loggerWarn(`[警告] ${message}`, options);
logger.info = (message, options) => loggerInfo(`[信息] ${message}`, options);
logger.error = (message, options) => loggerError(`[错误] ${message}`, options);

export default defineConfig({
	base: "./",
	root: "./",
	mode: "development",
	logLevel: "info",
	customLogger: logger,
	server: { strictPort: false, watch: { ignored: ["**/build/**"] } },
	optimizeDeps: { include: ["axios", "@tanstack/react-table", "motion/react"] },
});
