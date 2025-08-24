import { ChevronRight } from "lucide-react"
import { NavLink } from "react-router"
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
import { TabInfo, useBread } from "@/hooks/use-system"
import { useTabs } from "@/hooks/use-tabs"
export function NavMain({
  items,
}: {
  items: TabInfo[]
}) {
  const { handleSetCurrentBread } = useBread()
  const { addTab } = useTabs()

  const handleAddTab = (item: TabInfo) => {
    addTab(item)
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => item)
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <Collapsible
              key={item!.label}
              asChild
              defaultOpen={item!.hide}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item!.label}>
                    <div className="text-foreground p-1 rounded">
                      {item!.icon}
                    </div>
                    <span className="text-foreground font-bold">{item!.label}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children
                      ?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem!.label}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={subItem!.key} onClick={() => {
                                handleSetCurrentBread(subItem!.key)
                                handleAddTab(subItem)
                            }}>
                              <span className="text-foreground">{subItem!.label}</span>
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

