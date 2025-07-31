import { useSystemStore } from "@/store";

const useSystemSideBar = () => {
    const sidebarConfig = useSystemStore((state) => state.sidebarConfig)
    const sidebarTeams = () => sidebarConfig.teams
    const sidebarNavItems = () => sidebarConfig.items


    return {
        sidebarTeams,
        sidebarNavItems
    }
}

export {
    useSystemSideBar
}