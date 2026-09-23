import { defineConfig, loadEnv, mergeConfig } from "vite";
import type { ProxyOptions } from "vite";
import viteDevConfig from "./vite.dev.config.ts";
import viteBuildConfig from "./vite.build.config.ts";
import viteBaseConfig from "./vite.base.config.ts";

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const config = mergeConfig(viteBaseConfig, command === "serve" ? viteDevConfig : viteBuildConfig);

	if (command === "serve") {
		const managerApiProxy: ProxyOptions = {
			target: env.MANAGER_API_TARGET || "http://localhost:8082",
			changeOrigin: true,
			configure(proxy) {
				proxy.on("proxyReq", (proxyRequest) => proxyRequest.removeHeader("origin"));
			},
		};
		config.server = {
			...config.server,
			proxy: {
				...config.server?.proxy,
				"/api": managerApiProxy,
			},
		};
	}

	return config;
});
