import useSystemStore from "@/store/systemStore";
import { useMemo } from "react";
import type { AppRouteObject } from "@/types/router";
import type { SidebarTeam } from '@/types/systemType'
import { STATIC_APP_ROUTES } from "@/router/static-route";
import useUserStore from "@/store/userStore";


/** 提供静态路由定义和导航所需状态。 */
export interface TabInfo {
    key: string;
    label: string;
    icon?: React.ReactNode;
    order?: number;
    hide?: boolean;
    children?: TabInfo[]
}
interface UseStaticRoutesReturn {
    sidebarTeams: SidebarTeam[]
    sidebarNavItems: AppRouteObject[];
    availableTabs: TabInfo[];
}

const useStaticRoutes = (): UseStaticRoutesReturn => {
	const isSuperAdmin = useUserStore((state) => state.admin?.role === "SUPER_ADMIN");
    const route = useMemo(
        () => {
			const children = STATIC_APP_ROUTES.find((item) => item.path === "/")?.children ?? [];
			const hideAdminAccess = (nodes: AppRouteObject[]): AppRouteObject[] => nodes
				.filter((node) => isSuperAdmin || node.meta?.key !== "/usermanagement/admins")
				.map((node) => node.children ? { ...node, children: hideAdminAccess(node.children) } : node);
			return hideAdminAccess(children);
		},
		[isSuperAdmin],
    )
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
        useStaticRoutes,
    useBread,
    useSettingBar
}
