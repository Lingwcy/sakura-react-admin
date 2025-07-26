import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import router from './router/index.tsx'
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
