import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"
import { useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useTabs } from "@/hooks/use-tabs"
import { useSettingBar } from "@/hooks/use-system"
import clsx from "clsx"
export default function SystemTabs() {
    const {
        savedTabs,
        removeTab,
        selectedTab,
        setSelectedTab,
        navigateToTab
    } = useTabs()
    const { showHeaderTab } = useSettingBar()
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.scrollBy({ left: -100, behavior: 'smooth' })
            }
        }
    }

    const scrollRight = () => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollElement) {
                scrollElement.scrollBy({ left: 100, behavior: 'smooth' })
            }
        }
    }

    const handleCloseTab = (e: React.MouseEvent, key: string) => {
        e.stopPropagation() // 阻止事件冒泡
        removeTab(key)

    }

    const handleClickTab = (key: string) => {
        setSelectedTab(key)
        navigateToTab(key)
        
    }
    return (
        <div className={clsx(
            "justify-between items-center gap-0 w-full z-10 px-1 transition-all ease-in-out duration-300 flex",
            savedTabs.length < 1 || !showHeaderTab 
                ? "opacity-0 h-0" 
                : "opacity-100 h-8"
        )}>
            <Button variant='ghost' className="w-3 h-6 cursor-pointer" onClick={scrollLeft}>
                <Icon icon="line-md:chevron-small-left" size={23} />
            </Button>
            <div className="flex-1 min-w-0 ">
                <ScrollArea ref={scrollAreaRef} className="w-full">
                    <div className="flex whitespace-nowrap">
                        {
                            savedTabs.map((item) => (
                                <>
                                    <Badge
                                        onClick={() => handleClickTab(item.meta.key)}
                                        variant='secondary'
                                        key={item.meta.key} 
                                        className={clsx(
                                            "mr-0 flex-shrink-0 min-w-8 min-h-7 rounded-xs cursor-pointer transition-all ease-in-out duration-100",
                                            selectedTab === item.meta.key && "bg-primary text-white"
                                        )
                                    }>
                                        {item.meta.label}
                                        <div
                                            onClick={(e) => handleCloseTab(e, item.meta.key)}
                                            className="cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-100 rounded-sm ml-1 p-0.5">
                                            <Icon icon="line-md:close" size={18} />
                                        </div>
                                    </Badge>
                                    <Separator
                                        orientation="vertical"
                                        className="mr-1"
                                    />
                                </>
                            ))
                        }
                    </div>
                </ScrollArea>
            </div>
            <Button variant='ghost' className="w-3 h-6 cursor-pointer" onClick={scrollRight}>
                <Icon icon="line-md:chevron-small-right" size={23} />
            </Button>
        </div>
    )
}