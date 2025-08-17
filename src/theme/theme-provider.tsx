import { useSystemStore } from "@/store";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const themeMode = useSystemStore((state) => state.themeConfig.themeMode)
    const availableThemeMode = useSystemStore((state) => state.themeConfig.availableThemeMode)

    useEffect(() => {
        // 清除所有可能的主题类名
        const allThemeClasses = Object.keys(availableThemeMode)
        allThemeClasses.forEach(theme => {
            document.documentElement.classList.remove(theme)
        })

        // 添加当前主题类名
        document.documentElement.classList.add(themeMode)

        return () => {
            document.documentElement.classList.remove(themeMode)
        }
    }, [themeMode, availableThemeMode])

    return <>{children}</>
}