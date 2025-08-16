import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@ant-design/v5-patch-for-react-19';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLoading from './components/loading/app-loading';

// 懒加载路由组件
const Router = lazy(() => import('./router'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<AppLoading />}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </Suspense>
  </StrictMode>,
)
