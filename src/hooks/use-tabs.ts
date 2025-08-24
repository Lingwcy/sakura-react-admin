import { useNavigate } from "react-router"
import { useSystemStore } from "@/store"
import { useDynamicRoutes,TabInfo } from "./use-system"
import { findTreeTabByKey } from "@/utils/tree"
const useTabs = () => {
    // tabs必须维护一套items来控制整个导航系统
    const { availableTabs } = useDynamicRoutes()
    const navigate = useNavigate()
    const selectedTab = useSystemStore((state) => state.selectedTab)
    const savedTabs = useSystemStore((state) => state.savedTabs)
    const addTab = useSystemStore((state) => state.addTab)
    const removeTab = useSystemStore((state) => state.removeTab)
    const setSelectedTab = useSystemStore((state) => state.setSelectedTab)

    // 凭借availableTab，我们可以添加任何新的已存在tabs，因为Key作为路由始终唯一
    const navigateToTab = (key: string) => {
        if (savedTabs.find((tab) => tab.key === key)) {
            // 如果tab已存在，只需要选中它
            setSelectedTab(key)
            navigate(key)
            return
        }
        // 找不到，从availableTabs中查找并添加一个新的
        const res = findTreeTabByKey(availableTabs, key)
        if(res){
            savedTabs.push(res)
            setSelectedTab(key)
        }
        // 无论如何，我们都会给予导航，最坏的情况只不过是 跳转到缺省页
        navigate(key)
    }

    const addTabAndSelectAndCheckExist = (item: TabInfo) => {
        if (savedTabs.find((tab) => tab.key === item.key)) {
            // 如果tab已存在，只需要选中它
            setSelectedTab(item.key)
            return
        }
        addTab(item)
        setSelectedTab(item.key)
    }

    const removeTabAndCheck = (key: string) => {
        // 找到要删除的tab的索引
        console.log(key)
        console.log(selectedTab)
        const tabIndex = savedTabs.findIndex((tab) => tab.key === key)
        if (tabIndex === -1) return

        // 如果删除的不是当前选中的tab，只删除不跳转
        if (key !== selectedTab) {
            console.log("只删除")
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
        let targetTab: TabInfo
        if (tabIndex >= savedTabs.length - 1) {
            // 如果删除的是最后一个tab，选中前一个
            targetTab = savedTabs[tabIndex - 1]
        } else {
            // 否则选中下一个tab
            targetTab = savedTabs[tabIndex + 1]
        }

        // 先删除tab，再跳转
        removeTab(key)
        setSelectedTab(targetTab.key)
        navigate(targetTab.key)
    }

    return {
        savedTabs,
        removeTab: removeTabAndCheck,
        selectedTab,
        setSelectedTab,
        navigateToTab,
        addTab: addTabAndSelectAndCheckExist
    }

}

export {
    useTabs
}