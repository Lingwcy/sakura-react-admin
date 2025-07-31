import { Rotate3D, BadgeCheckIcon, VectorSquareIcon, Gamepad } from "lucide-react"
import { Badge } from "../ui/badge"
import type { MinecraftServerCardBadge } from "@/types/minecraft-server-item-type"

interface ServerCardBadgeList {
    badgeItem?: MinecraftServerCardBadge
}

export default function ServerCardBadgeList({ badgeItem }: ServerCardBadgeList) {
    return (
        <div className="flex md:flex-col md:space-y-1.5 space-x-1.5">
            {badgeItem?.version && (
                <Badge
                    variant="secondary"
                    className="bg-pink-400 text-white text-[10px] h-5 px-1.5 rounded-sm"
                >
                    <VectorSquareIcon className="h-3 w-3 mr-0.5" />
                    {badgeItem?.version}
                </Badge>
            )}

            {badgeItem?.isCrossVersion !== 0 && (
                <Badge
                    variant="secondary"
                    className="bg-pink-400 text-white text-[10px] h-5 px-1.5 rounded-sm"
                >
                    <Rotate3D className="h-3 w-3 mr-0.5" />
                    跨版本
                </Badge>
            )}

            {badgeItem?.gamemodes && (
                <Badge
                    variant="secondary"
                    className="bg-pink-400 text-white text-[10px] h-5 px-1.5 rounded-sm"
                >
                    <Gamepad className="h-3 w-3 mr-0.5" />
                    {badgeItem.gamemodes}
                </Badge>
            )}

            {badgeItem?.isAuthMode !== 0 && (
                <Badge
                    variant="secondary"
                    className="bg-pink-400 text-white text-[10px] h-5 px-1.5 rounded-sm"
                >
                    <BadgeCheckIcon className="h-3 w-3 mr-0.5" />
                    正版验证
                </Badge>
            )}
        </div>
    )
}