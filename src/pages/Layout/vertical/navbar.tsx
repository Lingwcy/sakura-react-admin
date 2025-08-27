import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Icon from "@/components/ui/icon"
import { useDynamicRoutes } from "@/hooks/use-system"
import { useTabs } from "@/hooks/use-tabs"
import { TabInfo, useBread } from "@/hooks/use-system"
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area"
import clsx from "clsx"
interface VerticalNavBarProps {
    className?: string
}
export function VerticalNavBar({ className }: VerticalNavBarProps) {
    const { addTab, navigateToTab } = useTabs()
    const { handleSetCurrentBread } = useBread()
    const { availableTabs } = useDynamicRoutes()
    const handleAddTab = (item: TabInfo) => {
        handleSetCurrentBread(item!.key)
        addTab(item)
        navigateToTab(item.key)
    }
    return (
        <ScrollArea  className=" overflow-x-auto">
            <ScrollBar orientation="horizontal" className="h-1.5 cursor-pointer hover:bg-secondary " />
            <div className={clsx(
                "flex space-x-1.5 whitespace-nowrap ",
                className
            )}>
                {
                    availableTabs.map(item => {
                        return (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="">
                                        <Button variant="ghost">
                                            {item.icon}
                                            {item.label}
                                            <Icon icon="line-md:chevron-down" />
                                        </Button>

                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="" align="start">
                                    <DropdownMenuGroup>
                                        {
                                            item.children && item.children.map(
                                                childItem => {
                                                    return (
                                                        <DropdownMenuItem onClick={() => handleAddTab(childItem)}>
                                                            {childItem.label}
                                                            <DropdownMenuShortcut>
                                                                {childItem.icon ? childItem.icon : <Icon icon="line-md:star-alt-filled" />}
                                                            </DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                    )
                                                }
                                            )
                                        }
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })
                }

            </div>
        </ScrollArea>
    )
}
