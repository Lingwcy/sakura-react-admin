import type { SilderNavItem, SidebarTeam } from '@/types/systemType'
import { create } from 'zustand'
import {
    BookOpen,
    Bot,
    GalleryVerticalEnd,
    Settings2,
    SquareTerminal,
    Cross,
    Key,
    UserCog2Icon,
    PercentDiamond,
} from "lucide-react"
type Store = {
    sidebarConfig: {
        teams: SidebarTeam[],
        items: SilderNavItem[],
    }
    breadConfig: {
        currentBread: string[]
    }
}

type Action = {
    setCurrentBread: (data: string[]) => void
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
                url: "/server/archive",
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
        title: "用户管理",
        url: "#",
        icon: UserCog2Icon,
        items: [
            {
                title: "后台用户",
                url: "usermanagement/user",
            },
            {
                title: "客户端用户",
                url: "usermanagement/font-user",
            },
        ],
    },
    {
        title: "权限管理",
        url: "#",
        icon: PercentDiamond,
        items: [
            {
                title: "后台用户权限",
                url: "auth/permission",
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
        title: "工具",
        icon: Key,
        url: "#",
        items: [
            {
                title: '接口器',
                url: '/tool/api'
            }
        ]
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
            },
            {
                title: '二级加载动画',
                url: '/cssplayground/loading-2'
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


const useSystemStore = create<Store & Action>()(
    (set) => ({
        sidebarConfig: {
            teams: initialSidebarTeamData,
            items: initialSidebarData,

        },
        breadConfig: {
            currentBread: ['首页', '关于项目']
        },
        setCurrentBread: (data) => {
            set((state) => ({
                ...state,
                breadConfig: { ...state, currentBread: data }
            }))
        }
    })
)


export default useSystemStore