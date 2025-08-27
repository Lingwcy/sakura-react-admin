import { useSystemStore } from "@/store";
import { usePermissionRoutes } from "@/router/hooks/use-permission-routes";
import { useMemo } from "react";
import { AppRouteObject } from "@/types/router";
import { SidebarTeam } from '@/types/systemType'


/**
 * 
 * 提供动态路由提供状态
 * 直接下游提供消费
 */
export interface TabInfo {
    key: string;
    label: string;
    icon?: React.ReactNode;
    order?: number;
    hide?: boolean;
    children?: TabInfo[]
}
interface UseDynamicRoutesReturn {
    sidebarTeams: SidebarTeam[]
    sidebarNavItems: AppRouteObject[];
    availableTabs: TabInfo[];
}

const useDynamicRoutes = (): UseDynamicRoutesReturn => {
    const route = usePermissionRoutes() // 动态路由渲染侧边栏
    const sidebarConfig = useSystemStore((state) => state.sidebarConfig)
    const sidebarTeams = sidebarConfig.teams

    // 可用tabs集合
    const availableTabs = useMemo<TabInfo[]>(() => {
        function getTabs(nodes: AppRouteObject[] = []): TabInfo[] {
            return nodes
                .filter((n) => n.meta?.key)            
                .map((n) => ({
                    key: n.meta!.key,
                    label: n.meta!.label,
                    icon: n.meta?.icon,
                    order: n.order,
                    hide: n.meta.hideTab,
                    children: getTabs(n.children),    
                }));
        }
        return getTabs(route);
    }, [route]);

    return {
        sidebarTeams,
        sidebarNavItems: route,
        availableTabs
    }
}

const useBread = () => {
    const setCurrentBread = useSystemStore((state) => state.setCurrentBread)
    const currentBread = useSystemStore((state) => state.breadConfig.currentBread)


    const handleSetCurrentBread = (breads: string) => {
        if (!breads) return
        breads = breads.slice(1)
        setCurrentBread(breads.split('/'))
    }

    return {
        currentBread,
        handleSetCurrentBread
    }
}

const useSettingBar = () => {
    const showHeaderTab = useSystemStore((state) => state.settingBarConfig.showHeaderTab)
    const showBreadCrumb = useSystemStore((state) => state.settingBarConfig.showBreadCrumb)
    const setShowHeaderTab = useSystemStore((state) => state.setShowHeaderTab)
    const setShowBreadCrumb = useSystemStore((state) => state.setShowBreadCrumb)
    const currentLayoutSelected = useSystemStore((state) => state.settingBarConfig.currentSelected)

    return {
        showHeaderTab,
        showBreadCrumb,
        currentLayoutSelected,
        setShowHeaderTab,
        setShowBreadCrumb
    }
}

export {
    useDynamicRoutes,
    useBread,
    useSettingBar
}