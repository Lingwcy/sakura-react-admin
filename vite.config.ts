
import { defineConfig, loadEnv } from 'vite'

import viteDevConfig from './vite.dev.config'
import viteBuildConfig from './vite.build.config'
import viteBaseConfig from './vite.base.config'
const envResolver = {
  "build": Object.assign({}, viteBaseConfig, viteBuildConfig),
  "serve": Object.assign({}, viteBaseConfig, viteDevConfig),
}



export default defineConfig(({ command, mode }) => {
  loadEnv(mode, process.cwd(), "")

  return envResolver[command];
})