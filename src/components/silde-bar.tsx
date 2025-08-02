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
import { useSystemSideBar } from "@/hooks/use-system"
import { useUserProfile } from "@/hooks/use-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {sidebarNavItems, sidebarTeams} = useSystemSideBar()
  const {userProfile} = useUserProfile()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarTeams()} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
