import type { SilderNavItem, SidebarTeam } from '@/types/systemType'
import { create } from 'zustand'
import {
    BookOpen,
    Bot,
    GalleryVerticalEnd,
    Settings2,
    SquareTerminal,
    Cross
} from "lucide-react"
type Store = {
    sidebarConfig: {
        teams: SidebarTeam[],
        items: SilderNavItem[]
    }
}

const initialSidebarData: SilderNavItem[] = [
    {
        title: "服务器",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: "已收录",
                url: "/server/list",
            },
            {
                title: "待审核",
                url: "#",
            },
            {
                title: "黑名单",
                url: "#",
            },
        ],
    },
    {
        title: "组件",
        url: "#",
        icon: Bot,
        items: [
            {
                title: "服务器卡片",
                url: "component/servercard",
            },
        ],
    },
    {
        title: "文档",
        url: "#",
        icon: BookOpen,
        items: []

    },
    {
        title: "设置",
        url: "#",
        icon: Settings2,
        items: [
        ],
    },
    {
        title: 'css靶场',
        url: '#',
        icon: Cross,
        items: [
            {
                title: '双飞翼布局',
                url: '/cssplayground/twowings'
            }
        ]
    }
]

const initialSidebarTeamData: SidebarTeam[] = [
    {
        name: "Sakura-React-Admin",
        logo: GalleryVerticalEnd,
        plan: "",
    },
]


const useSystemStore = create<Store>()(
    () => ({
        sidebarConfig: {
            teams: initialSidebarTeamData,
            items: initialSidebarData
        },
    })
)


export default useSystemStore