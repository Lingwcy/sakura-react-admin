import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import router from './router/index.ts'
import { RouterProvider } from 'react-router'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
