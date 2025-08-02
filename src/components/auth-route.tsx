import type { ReactNode } from "react";
import { useUserToken } from "@/hooks/use-user";
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