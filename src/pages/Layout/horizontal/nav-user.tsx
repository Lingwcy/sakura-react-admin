import { ChevronsUpDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { ManagerPrincipal } from "@/types/manager";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useManagerLogout } from "@/hooks/use-manager";

export function NavUser({ user }: { user: ManagerPrincipal | null }) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const logout = useManagerLogout();
	const name = user?.username?.trim() || user?.email || "管理员";
	const initials = name.slice(0, 2).toUpperCase();

	async function handleLogout() {
		try {
			await logout.mutateAsync();
		} catch {
			toast.error("退出请求失败，已清除本地会话");
		} finally {
			navigate("/login", { replace: true });
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" disabled={!user} className="data-[state=open]:bg-sidebar-accent">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarFallback className="rounded-lg">{user ? initials : "--"}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user ? name : "加载中…"}</span>
								<span className="truncate text-xs">{user?.email ?? ""}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col gap-1">
								<span className="font-medium">{name}</span>
								<span className="text-xs text-muted-foreground">{user?.role === "SUPER_ADMIN" ? "超级管理员" : "管理员"}</span>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={handleLogout} disabled={logout.isPending}>
							<LogOut />
							{logout.isPending ? "正在退出…" : "退出登录"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
