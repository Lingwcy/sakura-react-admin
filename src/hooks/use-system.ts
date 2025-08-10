import { useSystemStore } from "@/store";
import { usePermissionRoutes } from "@/router/hooks/use-permission-routes";
const useSystemSideBar = () => {
    const route = usePermissionRoutes()

    const sidebarConfig = useSystemStore((state) => state.sidebarConfig)
    const sidebarTeams = () => sidebarConfig.teams

    return {
        sidebarTeams,
        sidebarNavItems : route
    }
}

export {
    useSystemSideBar
}