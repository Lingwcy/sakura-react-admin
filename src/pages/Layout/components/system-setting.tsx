
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { CSSProperties } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ThemeItemList from "@/theme/components/theme-item-list"
const sheetContentBgStyle: CSSProperties = {
    // backgroundColor: `rgba(${themeVars.colors.background.paperChannel} / 0.9)`,
    opacity: 0.9,
};

export function SystemSetting() {
    return (
        <Sheet modal={true} >
            <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                    <Icon icon="line-md:cog-filled-loop" size={25} className="bg-background" />
                </Button>
            </SheetTrigger>
            <SheetHeader>
                <SheetTitle/>
                <SheetDescription/>
            </SheetHeader>
            <SheetContent style={sheetContentBgStyle} className="max-w-xs">
                <SheetHeader>
                </SheetHeader>
                <ScrollArea>
                    <div>
                        <div className="mb-0 text-base font-semibold text-text-secondary pl-4 ">主题</div>
                        <ThemeItemList/>
                    </div>
                </ScrollArea>
                <SheetFooter>
                    <Button
                        variant="outline"
                        className="w-full border-dashed text-text-primary hover:border-primary hover:text-primary"
                    >
                        <div
                            className="flex items-center justify-center"
                        >
                            <Icon icon="local:ic-settings-exit-fullscreen" size={25} color="#f55188" />
                        </div>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
