import type { SilderNavItem, SidebarTeam } from '@/types/systemType'
import { ThemeMode } from "@/types/enum";
import { AvailableThemeMode } from "@/types/enum";
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
import { TabInfo } from '@/hooks/use-system';

type Store = {
    sidebarConfig: {
        teams: SidebarTeam[],
        items: SilderNavItem[],
    },
    savedTabs: TabInfo[],
    selectedTab: string,
    breadConfig: {
        currentBread: string[]
    }
    themeConfig: {
        themeMode: ThemeMode,
        availableThemeMode: Record<ThemeMode, string>
    },
    settingBarConfig :{
        showHeaderTab: boolean
    }
}

type Action = {
    setCurrentBread: (data: string[]) => void
    setThemeMode: (data: ThemeMode) => void
    addTab: (data: TabInfo) => void
    removeTab: (data: string) => void
    setSelectedTab: (data: string) => void
    setShowHeaderTab: (data: boolean) => void
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
        name: "Sakura Admin",
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
        savedTabs: [],
        selectedTab: '',
        themeConfig: {
            themeMode: ThemeMode.Light,
            availableThemeMode: AvailableThemeMode
        },
        settingBarConfig: {
            showHeaderTab: true
        },
        setCurrentBread: (data) => {
            set((state) => ({
                ...state,
                breadConfig: { ...state, currentBread: data }
            }))
        },
        setThemeMode: (data) => {
            set((state) => ({
                ...state,
                themeConfig: { ...state.themeConfig, themeMode: data }
            }))
        },
        addTab: (data) => {
            set((state) => ({
                ...state,
                savedTabs: [...state.savedTabs, data]
            }))
        },
        removeTab: (data) => {
            set((state) => ({
                ...state,
                savedTabs: state.savedTabs.filter((item) => item.key !== data)
            }))
        },
        setSelectedTab: (data) => {
            set((state) => ({
                ...state,
                selectedTab: data
            }))
        },
        setShowHeaderTab: (data) => {
            set((state) => ({
                ...state,
                settingBarConfig: { ...state.settingBarConfig, showHeaderTab: data }
            }))
        }
    })
)


export default useSystemStore