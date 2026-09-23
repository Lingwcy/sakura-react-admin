import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
	plugins: [
		viteCompression({ threshold: 10 * 1024 }),
		visualizer({
			filename: "build/stats.html",
			open: false,
			gzipSize: true,
			brotliSize: true,
		}),
	],
	build: {
		assetsInlineLimit: 4096,
		outDir: "build",
		emptyOutDir: true,
	},
});
