import clsx from "clsx"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { CopyPlus, Network } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { DynamicBanner } from "../banner"
import type { MinecraftServerCardBadge } from "@/types/minecraft-server-item-type"
import ServerCardBadgeList from "./server-card-badge-list"
import BreathingLight from "../breathing-light"
interface ServerCardProps {
    className?: string
    serverName: string
    serverIconUrl: string
    bannerUrl?: string
    addressUrl: string
    serverBadge?: MinecraftServerCardBadge,
    maxPlayer: number,
    currentPlayer: number,
    isRuning?: boolean
}

export default function ServerCard({
    className,
    serverName,
    serverIconUrl,
    bannerUrl,
    addressUrl,
    maxPlayer,
    currentPlayer,
    serverBadge,
    isRuning = false,
}: ServerCardProps) {
    return (
        <div className={clsx(className)}>
            <Card className="py-2 rounded-sm max-w-3xl relative">
                <CardContent className="px-2">
                    <div className="flex flex-col md:flex-row text-center flex-1 min-w-[300px] md:space-x-1.5">
                        <div className="w-full md:w-[70px]  order-1 md:order-none items-center flex md:flex-col md:space-y-1 p-1 space-x-1">
                            <img
                                src={serverIconUrl}
                                alt="Arclight Server Icon"
                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                            />

                            <p className="text-sm  font-light line-clamp-2">{serverName}</p>
                        </div>
                        <div className="flex-1 min-w-[150px] order-2 flex-row">
                            <div className="w-full">
                                <DynamicBanner url={bannerUrl} />
                            </div>
                            <div className="">
                                <Progress className="rounded-none bg-pink-200" value={33} />
                            </div>
                            <div className="flex  items-center justify-between ">
                                <div className="flex space-x-1">
                                    <div>
                                        <p className="text-gray-800 font-light tracking-tight drop-shadow-sm line-clamp-1">{addressUrl}</p>
                                    </div>
                                    <Button variant="ghost" size="icon"
                                        className="w-5 h-5 cursor-pointer mt-1">
                                        <CopyPlus style={{ width: 14, height: 14 }} />
                                    </Button>
                                </div>

                                <div className=" inline-flex h-5 bg-pink-800 rounded-sm justify-center items-center p-0.5 flex-row space-x-0.5 mt-1">
                                    <Network style={{ width: 12, height: 12 }} color="pink" />
                                    <p style={{ fontSize: 11 }} className="text-gray-100 whitespace-nowrap">{currentPlayer}/{maxPlayer}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-[70px] order-3">
                            <ServerCardBadgeList badgeItem={serverBadge} />
                        </div>
                    </div>
                </CardContent>
                <BreathingLight isActive={isRuning}
                    className="absolute top-2 right-2 md:left-1 md:top-1" />
            </Card>

        </div>
    )
}