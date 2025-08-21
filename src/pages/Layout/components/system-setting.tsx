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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettingBar } from "@/hooks/use-system"
const sheetContentBgStyle: CSSProperties = {
    // backgroundColor: `rgba(${themeVars.colors.background.paperChannel} / 0.9)`,
    opacity: 1,
};


export function SystemSetting() {
    const { showHeaderTab, setShowHeaderTab } = useSettingBar()
    return (
        <Sheet modal={true} >
            <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                    <Icon icon="line-md:cog-filled-loop" size={25} className="bg-background" />
                </Button>
            </SheetTrigger>
            <SheetHeader hidden>
                <SheetTitle />
                <SheetDescription />
            </SheetHeader>
            <SheetContent style={sheetContentBgStyle} className="max-w-xs">
                <SheetHeader>
                </SheetHeader>
                <ScrollArea>
                    <div className="p-5">
                        <div className="flex items-center gap-2 my-1">
                            <Separator className="flex-1" />
                            <span className="text-md font-bold text-primary whitespace-nowrap">主题</span>
                            <Separator className="flex-1" />
                        </div>
                        <div className="mb-5">
                            <ThemeItemList />
                        </div>
                        <div className="flex items-center gap-2 my-1">
                            <Separator className="flex-1" />
                            <span className="text-md font-bold text-primary whitespace-nowrap">界面设置</span>
                            <Separator className="flex-1" />
                        </div>
                        <div>
                            <div className="flex justify-between p-3">
                                <Label className="font-bold text-md">头部导航栏Tab</Label>
                                <Switch 
                                    className="cursor-pointer"
                                    checked={showHeaderTab}
                                    onCheckedChange={setShowHeaderTab}
                                    />
                            </div>
                        </div>
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
