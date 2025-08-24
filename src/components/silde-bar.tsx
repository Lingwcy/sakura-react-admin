import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDynamicRoutes } from "@/hooks/use-system"
import { useUserProfile } from "@/hooks/use-user"
import { ScrollArea } from "./ui/scroll-area"

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
        <NavMain items={availableTabs} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
