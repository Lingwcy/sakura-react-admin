import type { ReactNode } from "react";
import { useUserToken } from "@/hooks/useUser";
import { useNavigate } from 'react-router'
import { useEffect } from "react";
type AuthRoutProps = {
    children: ReactNode
}

export function AuthRoute({ children }: AuthRoutProps) {
    const { userToken } = useUserToken()
    const nativate = useNavigate()
    useEffect(() => {
        if (!userToken.token) {
            nativate('/login')
        }
    }, [])
    return <>{children}</>

}