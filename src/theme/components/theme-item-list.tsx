import { Badge } from "@/components/ui/badge"
import { useTheme } from "../hook/use-theme"
import clsx from "clsx"
export default function ThemeItemList() {
    const { setThemeMode, availableThemeMode } = useTheme()
    return (
        <div className="flex flex-row flex-wrap gap-4 p-8 justify-between">
            {Object.entries(availableThemeMode).map(([key, value]) => (
                <ThemeItem key={key} themeMode={key} setThemeMode={setThemeMode} themeColor={value} />
            ))}
        </div>
    )

}


interface ThemeItemProps {
    themeMode: string,
    themeColor: string,
    setThemeMode: (themeMode: string) => void
}
function ThemeItem({ themeMode, themeColor, setThemeMode }: ThemeItemProps) {
    const { themeMode: currentThemeMode } = useTheme()
    const isActive = currentThemeMode === themeMode
    return (
        <>
            <Badge variant="secondary" className="group cursor-pointer w-23 h-23 transition" onClick={() => setThemeMode(themeMode)}>
                <div className={clsx(
                    "w-7 h-7 transition-all duration-100 rounded-full group-hover:w-18 group-hover:h-18",
                    isActive ? "w-18 h-18" : "w-7 h-7"
                )} 
                style={{ backgroundColor: themeColor }} />
            </Badge>
        </>
    )
}