import { AppSidebar } from "@/components/silde-bar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUserProfile } from "@/hooks/use-user"
import { Outlet } from "react-router"
import { Toaster } from "@/components/ui/sonner"
export default function () {
  const { getUserInfo } = useUserProfile()
  useEffect(() => {
    getUserInfo();
  }, [])
  return (
    <div className="h-full w-full flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full">
          <header className="flex bg-white border border-b-2 border-t-0 border-r-0 border-l-0 border-pink-500 h-12 items-center gap-2 w-full z-10">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      测试环境
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>默认</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-1 flex-col p-4">
                <Toaster />
                <Outlet />
              </div>
            </ScrollArea>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
