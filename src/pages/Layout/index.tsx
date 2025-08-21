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
import { SystemSetting } from "./components/system-setting"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import { useBread } from "@/hooks/use-system"
import { RouteLoadingProgress } from "@/components/loading"
import SystemTabs from "./components/system-tabs"
export default function () {

  const { currentBread } = useBread()

  return (
    <div className="h-full w-full flex flex-col">
      <RouteLoadingProgress />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-full">
          <header className="flex felx-row flex-wrap border-b-2 border-primary ">
            <div className="flex justify-between h-12 items-center gap-0 w-full z-10">
              <div className="flex items-center gap-2 px-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {currentBread && currentBread.length > 0 && (
                      <>
                        {currentBread.map((bread, index) => (
                          <BreadcrumbItem key={index}>
                            {index === currentBread.length - 1 ? (
                              <BreadcrumbPage>{bread}</BreadcrumbPage>
                            ) : (
                              <>
                                <BreadcrumbLink href="#">{bread}</BreadcrumbLink>
                                <BreadcrumbSeparator />
                              </>
                            )}
                          </BreadcrumbItem>
                        ))}
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-2 px-0">
                <SystemSetting />
              </div>
            </div>

            <SystemTabs />

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
