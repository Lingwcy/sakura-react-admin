import { useNavigate } from "react-router"
import { useSystemStore } from "@/store"
import { AppRouteObject } from "@/types/router"
const useTabs = () => {
    const navigate = useNavigate()
    const selectedTab = useSystemStore((state) => state.selectedTab)
    const savedTabs = useSystemStore((state) => state.savedTabs)
    const addTab = useSystemStore((state) => state.addTab)
    const removeTab = useSystemStore((state) => state.removeTab)
    const setSelectedTab = useSystemStore((state) => state.setSelectedTab)

    const navigateToTab = (key: string) => {
        navigate(key)
    }
    const addTabAndSelectAndCheckExist = (item: AppRouteObject) => {
        if (savedTabs.find((tab) => tab.meta.key === item.meta.key)) {
            // 如果tab已存在，只需要选中它
            setSelectedTab(item.meta.key)
            return
        }
        addTab(item)
        setSelectedTab(item.meta.key)
    }

    const removeTabAndCheck = (key: string) => {
        // 找到要删除的tab的索引
        const tabIndex = savedTabs.findIndex((tab) => tab.meta.key === key)
        if (tabIndex === -1) return

        // 如果删除的不是当前选中的tab，只删除不跳转
        if (key !== selectedTab) {
            removeTab(key)
            return
        }

        // 如果删除后没有tab了，导航到首页
        if (savedTabs.length <= 1) {
            removeTab(key)
            navigate('/')
            setSelectedTab('')
            return
        }

        // 计算删除后应该选中的tab
        let targetTab: AppRouteObject
        if (tabIndex >= savedTabs.length - 1) {
            // 如果删除的是最后一个tab，选中前一个
            targetTab = savedTabs[tabIndex - 1]
        } else {
            // 否则选中下一个tab
            targetTab = savedTabs[tabIndex + 1]
        }

        // 先删除tab，再跳转
        removeTab(key)
        setSelectedTab(targetTab.meta.key)
        navigate(targetTab.meta.key)
    }

    return {
        savedTabs,
        removeTab :removeTabAndCheck,
        selectedTab,
        setSelectedTab,
        navigateToTab,
        addTab: addTabAndSelectAndCheckExist
    }

}

export {
    useTabs
}