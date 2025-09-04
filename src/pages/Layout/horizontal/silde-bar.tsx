import * as React from "react"

import { NavUser } from "@/pages/Layout/horizontal/nav-user"
import { TeamSwitcher } from "@/pages/Layout/horizontal/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDynamicRoutes } from "@/hooks/use-system"
import { useUserProfile } from "@/hooks/use-user"
import { ScrollArea } from "../../../components/ui/scroll-area"
import HorizontalNavBar from "./horizontal-nav-bar"
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarTeams,availableTabs} = useDynamicRoutes()
  const {userProfile} = useUserProfile()
  return (
    <Sidebar collapsible="icon" {...props} className="border-r-2 border-gray-300">
      <SidebarHeader className="">
        <TeamSwitcher teams={sidebarTeams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
        <HorizontalNavBar items={availableTabs} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
