import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Vertical } from "./vertical"
import { Label } from "../ui/label"
import Icon from "../ui/icon"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

export default function LayoutItem() {
    const [isHovered, setIsHovered] = useState(false)
    const [isSelected, setIsSelected] = useState(false)

    const handleClick = () => {
        setIsSelected(!isSelected)
    }

    return (
        <AnimatePresence>
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handleClick}
                className="relative"
                whileTap={{scale:0.9}}
            >
                <div className="flex justify-center flex-col items-center cursor-pointer">
                    <div className="w-[100px] h-[60px] p-1 relative">
                        <Vertical />
                        <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-md"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: (isHovered || isSelected) ? 1 : 0,
                                opacity: (isHovered || isSelected) ? 1 : 0
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        />
                    </div>
                    <Tooltip>
                        <TooltipTrigger className="flex space-x-0.5 items-center cursor-pointer mt-1">
                            <Label className="font-light text-xs">垂直</Label>
                            <Icon icon="line-md:bell-alert-filled-loop" size={12}></Icon>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>左侧导航栏，右侧内容区域的垂直布局</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </motion.div>
        </AnimatePresence>

    )
}