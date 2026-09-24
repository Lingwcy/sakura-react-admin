# Oolong Comics 管理后台

漫画平台管理界面，使用 React、TypeScript、Vite 和 TanStack Query。用户、漫画项目、管理员与仪表盘数据均从 `oolong-comics-manager-server` 获取。

## 本地开发

需要 Node.js 22.22 或更新版本，以及 npm。先按 [后端项目说明](../oolong-comics-manager-server/README.md) 启动管理后台 API，默认地址为 `http://localhost:8082`。开发服务器会把 `/api` 请求代理到该地址。

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`。如后端使用其他地址，可在 `.env.development` 中设置 `MANAGER_API_TARGET`。

登录使用漫画平台中已注册并获准的邮箱和密码。首次启动超级管理员账号由后端的 `MANAGER_BOOTSTRAP_EMAIL` 配置初始化。

## 构建与部署

```bash
npm run build
npm run preview
```

生产环境需将同源 `/api` 请求反向代理到 `oolong-comics-manager-server`。前端默认使用 `/api` 作为 API 基地址。
