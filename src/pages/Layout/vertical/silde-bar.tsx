import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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

    const isLeaf = (n: TabInfo) => !n.children || n.children.length === 0
    const RecursiveMenuItems = ({ nodes }: { nodes: TabInfo[] }) => (
        <>
            {nodes.map((child) =>
                isLeaf(child) ? (
                    <DropdownMenuItem key={child.key} onClick={() => handleAddTab(child)}>
                        {child.label}
                        <DropdownMenuShortcut>
                            {child.icon ? child.icon : <Icon icon="line-md:star-alt-filled" />}
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuSub key={child.key}>
                        <DropdownMenuSubTrigger>
                            {child.label}
                            <DropdownMenuShortcut>
                                {child.icon ? child.icon : <Icon icon="line-md:chevron-right" />}
                            </DropdownMenuShortcut>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuGroup>
                                <RecursiveMenuItems nodes={child.children!} />
                            </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                )
            )}
        </>
    )

    return (
        <ScrollArea  className=" overflow-x-auto">
            <ScrollBar orientation="horizontal" className="h-1.5 cursor-pointer hover:bg-secondary " />
            <div className={clsx(
                "flex space-x-1.5 whitespace-nowrap ",
                className
            )}>
                {
                    availableTabs.map(item => {
                        // 如果没有children，直接作为路由节点
                        if (!item.children || item.children.length === 0) {
                            return (
                                <Button 
                                    key={item.key}
                                    variant="ghost" 
                                    onClick={() => handleAddTab(item)}
                                    className="cursor-pointer"
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            )
                        }
                        
                        return (
                            <DropdownMenu key={item.key}>
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
                                        <RecursiveMenuItems nodes={item.children!} />
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
