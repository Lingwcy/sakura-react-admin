import { AppSidebar } from "@/pages/Layout/horizontal/silde-bar"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { RouteLoadingProgress } from "@/components/loading"
import { BorderLoading } from "@/components/loading"
import { Suspense } from "react"
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useLocation } from 'react-router';
import { useOutlet } from 'react-router';
import Header from "./header"
import { useSettingBar } from "@/hooks/use-system"
import VerticalHeader from "./vertical/vertical-header"
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition: Transition = {
  type: 'spring',
  ease: 'easeInOut',
  duration: 0.3,
};

export default function () {
  const {currentLayoutSelected} = useSettingBar()
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="h-full w-full flex flex-col">
      <RouteLoadingProgress />
      <SidebarProvider>
        {currentLayoutSelected !== 3 && <AppSidebar />}
        <SidebarInset className="flex flex-col h-full">
          <Header headerLeftSlot = {currentLayoutSelected !== 3 ?"":<VerticalHeader/>}/>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-1 flex-col p-4">
                <Toaster />

                <div className="relative flex-1 w-full">
                  <AnimatePresence mode="wait" >

                    <motion.div
                      key={location.pathname}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={pageTransition}
                    >
                      <Suspense fallback={<BorderLoading showAlways />}>
                        {outlet}
                      </Suspense>

                    </motion.div>

                  </AnimatePresence>
                </div>
              </div>
            </ScrollArea>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
