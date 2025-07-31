import { type LucideIcon } from "lucide-react"

export type SilderNavItem = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: SilderNavItem[]
}

export type SilderSubNavItem = {
    title: string,
    url: string
}

export type SidebarTeam = {
    name: string
    logo: React.ElementType
    plan: string
}