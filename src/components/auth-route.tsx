import type { ReactNode } from "react";
import { useUserToken } from "@/hooks/use-user";
import { useNavigate, useLocation } from 'react-router'
import { useEffect } from "react";
type AuthRoutProps = {
    children: ReactNode
}

export function AuthRoute({ children }: AuthRoutProps) {
    const { userToken } = useUserToken()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // 只有当前不在登录页面且没有token时才跳转到登录页
        if (!userToken.token || userToken.token == "" && location.pathname !== '/login') {
            navigate('/login', { replace: true })
        }
    }, [userToken.token, navigate, location.pathname])

    // 如果没有token，不渲染子组件
    if (!userToken.token) {
        return null
    }

    return <>{children}</>

}