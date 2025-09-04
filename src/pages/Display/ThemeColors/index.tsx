import { ThemeColor, getColorListAsync } from "@/utils/color"
import { useTheme } from "@/theme/hook/use-theme"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function ThemeColorPage() {
    const { themeMode } = useTheme()
    const [colors, setColors] = useState<{ name: string; value: string; variable: string }[]>([])

    useEffect(() => {
        let canceled = false
        const entries = Object.entries(ThemeColor)
        const vars = entries.map(([, variable]) => variable);

        (async () => {
            const values = await getColorListAsync(vars)
            if (canceled) return
            const colorList = entries.map(([name, variable], i) => ({
                name,
                value: values[i],
                variable
            }))
            setColors(colorList)
        })()

        return () => { canceled = true }
    }, [themeMode])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold  mb-6">主题颜色</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colors.map(({ name, value, variable }) => (
                    <div key={name} className="flex flex-col items-center space-y-2">
                        <Badge 
                            variant="outline" 
                            className="w-full h-12 justify-center border-2"
                            style={{ 
                                backgroundColor: value || 'transparent',
                                borderColor: value || 'var(--border)',
                            }}
                        >
                        </Badge>
                        <div className="text-xs text-muted-foreground text-center">
                            <div className="font-bold">{name}</div>
                            <div className="font-medium italic">{variable}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}