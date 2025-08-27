
import { SystemSetting } from "./components/system-setting"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import SystemTabs from "./components/system-tabs"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import HeaderBreadCrumb from "./breadcrumb"
import { useSettingBar } from "@/hooks/use-system"
import { VerticalNavBar } from "./vertical/navbar"

interface HeaderProps {
    headerLeftSlot?: React.ReactNode | null;
}



export default function Header({ headerLeftSlot }: HeaderProps) {
    const {
        showBreadCrumb,
        currentLayoutSelected
    } = useSettingBar()
    return (
        <header className="flex felx-row flex-wrap space-y-1">
            <div className="flex justify-between h-12 items-center gap-0 w-full z-10 border-b-1 border-gray-300">
                <div className="flex items-center gap-2 px-2">

                    {currentLayoutSelected !== 3 &&
                        <>
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            {showBreadCrumb && <HeaderBreadCrumb />}
                        </>
                    }


                    {headerLeftSlot && headerLeftSlot}


                </div>
                <div className="flex items-center px-0">
                    <Button variant="ghost" className="cursor-pointer">
                        <Icon icon="meteor-icons:language" size={21} className=" cursor-pointer" />
                    </Button>
                    <Button variant="ghost" className="cursor-pointer">
                        <Icon icon="iconamoon:screen-full-duotone" size={23} className=" cursor-pointer" />
                    </Button>
                    <SystemSetting />
                </div>
            </div>
            {currentLayoutSelected == 3 &&<VerticalNavBar />}
            <SystemTabs />
        </header>
    )
}