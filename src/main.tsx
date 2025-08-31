import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './theme/theme-provider';
import AppLoading from './components/loading/app-loading';
// 懒加载路由组件
const Router = lazy(() => import('./router'));

// 生产环境 mock 设置
async function setupMock() {
  if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true') {
    const { setupProdMockServer } = await import('./mockProdServer');
    setupProdMockServer();
    console.log("生产环境mock已启用");
  }
}

// 初始化 mock
setupMock();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

// function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
//   // 阶段中文映射
//   const phaseMap = {
//     mount:   '挂载',
//     update:  '更新',
//     nestedUpdate: '副作用',
//   };
//   const phaseText = phaseMap[phase] ?? phase;

//   // 颜色映射
//   const colorMap = {
//     mount:   '#52c41a',   // 绿色
//     update:  '#faad14',   // 橙色
//     passive: '#1890ff',   // 蓝色
//   };
//   const color = colorMap[phase] ?? '#8c8c8c';

//   // 计算提交耗时
//   const commitDuration = commitTime - startTime;

//   console.log(
//     `%c【${id}】 %c${phaseText} %c` +
//     `实际耗时: ${actualDuration.toFixed(2)} ms, ` +
//     `未优化耗时: ${baseDuration.toFixed(2)} ms, ` +
//     `提交耗时: ${commitDuration.toFixed(2)} ms`,
//     'font-weight: bold',                     // id 样式
//     `color:${color};font-weight:bold`,       // phase 样式
//     'color: inherit'                         // 其余样式
//   );
// }


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<AppLoading />}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
)
