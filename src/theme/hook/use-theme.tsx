
import { useSystemStore } from "@/store";

export const useTheme = () => {
    const themeMode = useSystemStore((state) => state.themeConfig.themeMode)
    const setThemeMode = useSystemStore((state) => state.setThemeMode)
    const availableThemeMode = useSystemStore((state) => state.themeConfig.availableThemeMode)

    return {
        themeMode,
        setThemeMode,
        availableThemeMode
    }
}