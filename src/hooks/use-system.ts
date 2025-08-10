import { useSystemStore } from "@/store";
import { usePermissionRoutes } from "@/router/hooks/use-permission-routes";
const useSystemSideBar = () => {
    const route = usePermissionRoutes() // 动态路由渲染侧边栏
    const sidebarConfig = useSystemStore((state) => state.sidebarConfig)
    const sidebarTeams = () => sidebarConfig.teams




    return {
        sidebarTeams,
        sidebarNavItems : route
    }
}

const useBread =() => {
    const setCurrentBread = useSystemStore((state) => state.setCurrentBread)
    const currentBread = useSystemStore((state) => state.breadConfig.currentBread)


    const handleSetCurrentBread = (breads: string) => {
        if(!breads) return
        breads = breads.slice(1)
        setCurrentBread(breads.split('/'))
    }

    return {
        currentBread,
        handleSetCurrentBread
    }
}

export {
    useSystemSideBar,
    useBread
}