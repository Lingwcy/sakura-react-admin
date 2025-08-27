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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSettingBar } from "@/hooks/use-system"

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabsContents,
} from '@/components/animate-ui/components/tabs';
import LayoutItem from "@/components/layout/layout-item"


const sheetContentBgStyle: CSSProperties = {
    opacity: 1,
};


export function SystemSetting() {
    const {
        showHeaderTab,
        showBreadCrumb,
        setShowBreadCrumb,
        setShowHeaderTab,

    } = useSettingBar()
    return (
        <Sheet modal={true} >
            <SheetTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                    <Icon icon="line-md:cog-filled-loop" size={25} className="bg-background" />
                </Button>
            </SheetTrigger>
            <SheetContent style={sheetContentBgStyle} className="max-w-xs">
                <SheetHeader className="border-b-1 border-primary">
                    <SheetTitle className=" space-x-1">
                        <span className="text-primary">偏好设置</span>
                        <span className="text-[10px] italic text-gray-500 font-light inline-block align-top ">
                            自定义偏好设置&支持实时更新
                        </span>
                    </SheetTitle>
                    <SheetDescription hidden>
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea>
                    <div className="w-full flex justify-center ">
                        <Tabs className="rounded-lg w-[320px] md:w-[310px] lg:w-[370px]">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="1" className="text-xs">外观</TabsTrigger>
                                <TabsTrigger value="2" className="text-xs">布局</TabsTrigger>
                                <TabsTrigger value="3" className="text-xs">通用</TabsTrigger>
                            </TabsList>

                            <TabsContents>
                                <TabsContent value="1" className="">
                                    <div className="p-1">
                                        <div className="flex items-center gap-2 my-1">
                                            <Label className="font-bold text-[15px]">主题</Label>
                                        </div>
                                        <div className="mb-5">
                                            <ThemeItemList />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 my-1">
                                                <Label className="font-bold text-[15px]">其他</Label>
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">深色侧边栏</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showHeaderTab}
                                                    onCheckedChange={setShowHeaderTab}
                                                />
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">深色顶栏</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showHeaderTab}
                                                    onCheckedChange={setShowHeaderTab}
                                                />
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">色弱模式</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showHeaderTab}
                                                    onCheckedChange={setShowHeaderTab}
                                                />
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">灰色模式</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showHeaderTab}
                                                    onCheckedChange={setShowHeaderTab}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="2" className="">
                                    <div className="p-1">
                                        <div className="flex items-center gap-2 my-1">
                                            <Label className="font-bold text-[15px]">布局</Label>
                                        </div>
                                        <div className="grid grid-cols-3 mb-5">
                                            <LayoutItem />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 my-1">
                                                <Label className="font-bold text-[15px]">其他</Label>
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">导航栏Tab</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showHeaderTab}
                                                    onCheckedChange={setShowHeaderTab}
                                                />
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <Label className="font-light text-[15px]">面包屑</Label>
                                                <Switch
                                                    className="cursor-pointer"
                                                    checked={showBreadCrumb}
                                                    onCheckedChange={setShowBreadCrumb}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="3" className="space-y-6 p-6">
                                    <Button>待开发</Button>
                                </TabsContent>
                            </TabsContents>
                        </Tabs>
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
                            恢复默认设置
                            <Icon icon="local:ic-settings-exit-fullscreen" size={25} color="#f55188" />
                        </div>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
