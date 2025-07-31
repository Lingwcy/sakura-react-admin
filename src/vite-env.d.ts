/// <reference types="vite/client" />

declare module '*?url' {
  const url: string;
  export default url;
}

interface ImportMetaEnv {
	readonly VITE_APP_BASE_API: string;
	readonly VITE_APP_ENV: "development" | "production";
}