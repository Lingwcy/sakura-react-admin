import type { SilderNavItem, SidebarTeam } from '@/types/systemType'
import { ThemeMode } from "@/types/enum";
import { AvailableThemeMode } from "@/types/enum";
import { create } from 'zustand'
import {
    BookOpen,
    Bot,
    GalleryVerticalEnd,
    Settings2,
    Key,
    UserCog2Icon,
} from "lucide-react"
import { TabInfo } from '@/hooks/use-system';
import { layoutSettingItems } from '@/hooks/use-layout';

type LayoutSettingItem = {
    key: number
    label: string
    tooTip: string
    isEnable: boolean
    isHovered?: boolean
    isSelected?: boolean
    render: () => React.JSX.Element
}


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
    settingBarConfig: {
        showHeaderTab: boolean,
        showBreadCrumb: boolean,
        layoutSettingItems: LayoutSettingItem[],
        currentSelected: number
    }
}

type Action = {
    setCurrentBread: (data: string[]) => void
    setThemeMode: (data: ThemeMode) => void
    addTab: (data: TabInfo) => void
    removeTab: (data: string) => void
    setSelectedTab: (data: string) => void
    setShowHeaderTab: (data: boolean) => void
    setShowBreadCrumb: (data: boolean) => void
    setSettingLayoutItemHover: (key: number, value: boolean) => void
    setSettingLayoutItemCurrentSelected: (key: number) => void
    setSettingLayoutItemSelected: (key: number) => void
}

const initialSidebarData: SilderNavItem[] = [
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
]

const initialSidebarTeamData: SidebarTeam[] = [
    {
        name: "AI Comics",
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
            showHeaderTab: true, //tab卡片
            showBreadCrumb: true, //面包屑
            layoutSettingItems: layoutSettingItems.map(item => ({ ...item, isHovered: false, isSelected: false })),
            currentSelected: 0
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
        },
        setShowBreadCrumb: (data) => {
            set((state) => ({
                ...state,
                settingBarConfig: { ...state.settingBarConfig, showBreadCrumb: data }
            }))
        },
        setSettingLayoutItemHover(key, value) {
            set((state) => ({
                ...state,
                settingBarConfig: {
                    ...state.settingBarConfig,
                    layoutSettingItems: state.settingBarConfig.layoutSettingItems.map(item => (item.key === key ? { ...item, isHovered: value } : item))
                }
            }))
        },
        setSettingLayoutItemCurrentSelected(key) {
            set((state) => ({
                ...state,
                settingBarConfig: {
                    ...state.settingBarConfig,
                    currentSelected: key
                }
            }))
        },
        setSettingLayoutItemSelected(key: number) {
            set(state => ({
                ...state,
                settingBarConfig: {
                    ...state.settingBarConfig,
                    // 1. 先全部置 false
                    layoutSettingItems: state.settingBarConfig.layoutSettingItems.map(i =>
                        i.key === key ? { ...i, isSelected: true } : { ...i, isSelected: false }
                    ),
                    // 2. 同时更新 currentSelected
                    currentSelected: key,
                },
            }))
        }
    })
)


export default useSystemStore
