
import { FlowerIcon } from "lucide-react"

interface VerticalHeaderProps {
    currentLayout: number
}

export default function VerticalHeader({ currentLayout }: VerticalHeaderProps) {
    return (
        <div className="gap-0 px-0 flex justify-center items-center cursor-pointer select-none">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background">
                <FlowerIcon className="size-6 text-foreground" />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate text-primary font-bold">Sakura Admin</span>
            </div>
            
        </div>
    )
}