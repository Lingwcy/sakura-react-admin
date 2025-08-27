import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "../ui/label"
import Icon from "../ui/icon"
import { AnimatePresence, motion } from "motion/react"
import { useLayoutSettingItem } from "@/hooks/use-layout"
export default function LayoutItem() {
    const { items, setItemHover, handleItemClick } = useLayoutSettingItem()

    return (
        <div className="">
            <AnimatePresence>
                <motion.div className="flex w-[350px] lg:w-[380px]   flex-wrap ">
                    {items.map(item => (
                        <div
                            key={item.key}
                            className="lg:m-2 md:m-1 flex justify-center flex-col items-center cursor-pointer"
                            onMouseEnter={() => setItemHover(item.key, true)}
                            onMouseLeave={() => setItemHover(item.key, false)}
                            onClick={() => handleItemClick(item.key)}
                        >
                            <div className="w-[100px] h-[60px] p-1 relative">
                                {item.render()}
                                <motion.div
                                    className="absolute inset-0 border-2 border-primary rounded-md"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: item.isHovered || item.isSelected ? 1 : 0,
                                        opacity: item.isHovered || item.isSelected ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    
                                />
                            </div>

                            <Tooltip>
                                <TooltipTrigger className="flex space-x-0.5 items-center cursor-pointer mt-1">
                                    <Label className="font-light text-xs">{item.label}</Label>
                                    <Icon icon="line-md:bell-alert-filled-loop" size={12} />
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{item.tooTip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>

    )
}