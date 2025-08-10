
import { ChevronRight } from "lucide-react"
import { NavLink } from "react-router"
import { AppRouteObject } from "@/types/router"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: AppRouteObject[]
}) {

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => item.meta)
          .sort((a,b) => a.order - b.order) 
          .map((item) => (
          <Collapsible
            key={item.meta!.label}
            asChild
            defaultOpen={item.meta!.hideTab}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.meta!.label}>
                  {item.meta!.icon}
                  <span>{item.meta!.label}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children
                    ?.filter((subItem) => subItem.meta) // 过滤掉没有 meta 的子路由项
                    ?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.meta!.label}>
                      <SidebarMenuSubButton asChild>
                        <NavLink to={subItem.meta!.key} >
                          <span>{subItem.meta!.label}</span>
                        </NavLink>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
