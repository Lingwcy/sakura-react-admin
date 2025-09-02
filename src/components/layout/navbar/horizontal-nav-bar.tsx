import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { TabInfo, useBread } from "@/hooks/use-system";
import { useTabs } from "@/hooks/use-tabs";
import { NavLink } from "react-router";
import { useDynamicRoutes } from "@/hooks/use-system";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HorizontalNavBar() {
    const { handleSetCurrentBread } = useBread();
    const { addTab } = useTabs();
    const handleAddTab = (item: TabInfo) => {
        addTab(item);
    };
    const { availableTabs } = useDynamicRoutes()

    return (
        <SidebarGroup>
            <SidebarMenu>
                {availableTabs?.map((item) => (
                    <HorizontalNavBarItem
                        key={item.key}
                        item={item}
                        onAddTab={handleAddTab}
                        onSetBread={handleSetCurrentBread}
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

interface HorizontalNavBarItemProps {
    item: TabInfo,
    onAddTab: (item: TabInfo) => void,
    onSetBread: (key: string) => void
}

function HorizontalNavBarItem({ item, onAddTab, onSetBread }: HorizontalNavBarItemProps) {
    const hasChildren = item.children && item.children.length > 0;
    const [open, setOpen] = useState(false);

    if (hasChildren) {
        return (
            <Collapsible
                key={item.label}
                asChild
                className="group/collapsible"
                open={open}
                onOpenChange={setOpen}
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.label}>
                            <div className="text-foreground p-1 rounded">
                                {item.icon}
                            </div>
                            <span className="text-foreground font-bold">
                                {item.label}
                            </span>
                            <motion.span
                                className="ml-auto"
                                animate={{ rotate: open ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronRight />
                            </motion.span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <AnimatePresence initial={false}>
                            {open && (
                                <motion.div
                                    key="submenu"
                                    initial="collapsed"
                                    animate="open"
                                    exit="collapsed"
                                    variants={{
                                        open: {
                                            opacity: 1,
                                            height: "auto",
                                            transition: { staggerChildren: 0.05, delayChildren: 0.03 },
                                        },
                                        collapsed: { opacity: 0, height: 0 },
                                    }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <SidebarMenuSub>
                                        {item.children?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.key}>
                                                <motion.div
                                                    variants={{
                                                        open: { opacity: 1, y: 0 },
                                                        collapsed: { opacity: 0, y: -6 },
                                                    }}
                                                >
                                                    {subItem.children && subItem.children.length > 0 ? (
                                                        <HorizontalNavBarItem
                                                            item={subItem}
                                                            onAddTab={onAddTab}
                                                            onSetBread={onSetBread}
                                                        />
                                                    ) : (
                                                        <SidebarMenuSubButton asChild>
                                                            <NavLink
                                                                to={subItem.key}
                                                                onClick={() => {
                                                                    onSetBread(subItem.key);
                                                                    onAddTab(subItem);
                                                                }}
                                                            >
                                                                <motion.span
                                                                    className="text-foreground"
                                                                    whileHover={{ x: 2 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                >
                                                                    {subItem.label}
                                                                </motion.span>
                                                            </NavLink>
                                                        </SidebarMenuSubButton>
                                                    )}
                                                </motion.div>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.label} asChild>
                <NavLink
                    to={item.key}
                    onClick={() => {
                        onSetBread(item.key);
                        onAddTab(item);
                    }}
                >
                    <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-foreground p-1 rounded">
                            {item.icon}
                        </div>
                        <span className="text-foreground font-bold">
                            {item.label}
                        </span>
                    </motion.div>
                </NavLink>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}