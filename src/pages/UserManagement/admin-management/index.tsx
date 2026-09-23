import { useState, type FormEvent } from "react";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatManagerDate, PageHeading, QueryFeedback } from "@/components/manager/manager-ui";
import { useAddManagerAdmin, useManagerAdmins, useRemoveManagerAdmin } from "@/hooks/use-manager";
import useUserStore from "@/store/userStore";
import { getRequestErrorMessage } from "@/utils/request";

export default function ManagerAdminManagement() {
	const currentAdmin = useUserStore((state) => state.admin);
	const canManage = currentAdmin?.role === "SUPER_ADMIN";
	const adminsQuery = useManagerAdmins(canManage);
	const addAdmin = useAddManagerAdmin();
	const removeAdmin = useRemoveManagerAdmin();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [email, setEmail] = useState("");
	const admins = adminsQuery.data ?? [];

	async function handleAdd(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await addAdmin.mutateAsync(email.trim());
			setEmail("");
			setDialogOpen(false);
			toast.success("管理员已添加");
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "添加管理员失败"));
		}
	}

	async function handleRemove(userId: number, username: string) {
		if (!window.confirm(`确定移除管理员「${username}」吗？`)) return;
		try {
			await removeAdmin.mutateAsync(userId);
			toast.success("管理员权限已移除");
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "移除管理员失败"));
		}
	}

	if (!canManage) {
		return (
			<div className="mx-auto w-full max-w-7xl">
				<PageHeading title="后台管理员" description="管理员账号管理仅限超级管理员操作。" />
				<Card><CardContent className="flex items-center gap-3 py-8 text-sm text-muted-foreground"><ShieldCheck className="size-5" />当前账号没有管理权限。</CardContent></Card>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl">
			<PageHeading
				title="后台管理员"
				description="管理员必须是漫画平台中已注册且有效的用户。超级管理员账号不能被移除。"
				actions={<Button onClick={() => setDialogOpen(true)}><Plus />添加管理员</Button>}
			/>
			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[680px] text-sm">
							<thead className="border-b bg-muted/40 text-left text-muted-foreground"><tr>{["管理员", "角色", "授权时间", ""].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
							<tbody className="divide-y">
								{adminsQuery.isLoading || adminsQuery.isError || admins.length === 0 ? (
									<tr><td colSpan={4} className="px-4"><QueryFeedback loading={adminsQuery.isLoading} error={adminsQuery.error} empty={!adminsQuery.isLoading && !adminsQuery.isError} /></td></tr>
								) : admins.map((admin) => {
									const name = admin.username?.trim() || admin.email;
									const protectedAccount = admin.role === "SUPER_ADMIN" || admin.userId === currentAdmin?.userId;
									return (
										<tr key={admin.userId} className="hover:bg-muted/30">
											<td className="px-4 py-3"><div className="font-medium">{name}</div><div className="text-xs text-muted-foreground">{admin.email}</div></td>
											<td className="px-4 py-3"><Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>{admin.role === "SUPER_ADMIN" ? "超级管理员" : "管理员"}</Badge></td>
											<td className="px-4 py-3">{formatManagerDate(admin.createdAt)}</td>
											<td className="px-4 py-3 text-right">{!protectedAccount && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => void handleRemove(admin.userId, name)} disabled={removeAdmin.isPending}><Trash2 className="size-4" />移除</Button>}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<form onSubmit={handleAdd} className="space-y-5">
						<DialogHeader>
							<DialogTitle>添加管理员</DialogTitle>
							<DialogDescription>输入漫画平台中已注册的用户邮箱。该账号会立即获得管理台访问权限。</DialogDescription>
						</DialogHeader>
						<div className="space-y-2">
							<label htmlFor="manager-admin-email" className="text-sm font-medium">邮箱</label>
							<Input id="manager-admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" />
						</div>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
							<Button type="submit" disabled={addAdmin.isPending}>{addAdmin.isPending ? "添加中…" : "确认添加"}</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
