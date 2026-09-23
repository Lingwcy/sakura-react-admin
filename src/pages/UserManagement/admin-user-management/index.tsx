import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatManagerDate, ManagerPagination, PageHeading, QueryFeedback, StatusBadge } from "@/components/manager/manager-ui";
import { useManagerUser, useManagerUsers } from "@/hooks/use-manager";

const PAGE_SIZE = 20;

export default function ManagerUserManagement() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
	const keyword = useDeferredValue(search.trim());
	const status = statusFilter === "all" ? undefined : Number(statusFilter) as 0 | 1;
	const query = useManagerUsers({ page, pageSize: PAGE_SIZE, keyword, status });
	const detailQuery = useManagerUser(selectedBizId);
	const users = query.data?.list ?? [];

	function updateSearch(value: string) {
		setSearch(value);
		setPage(1);
	}

	function updateStatus(value: string) {
		setStatusFilter(value);
		setPage(1);
	}

	return (
		<div className="mx-auto w-full max-w-7xl">
			<PageHeading title="漫画用户" description="查询漫画平台注册用户及其项目、积分信息。此处为只读管理接口。" />
			<div className="mb-4 flex flex-wrap gap-3">
				<div className="relative min-w-56 flex-1 sm:max-w-sm">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="搜索邮箱、昵称或业务 ID" className="pl-9" />
				</div>
				<select className="h-9 rounded-md border bg-background px-3 text-sm" value={statusFilter} onChange={(event) => updateStatus(event.target.value)} aria-label="筛选用户状态">
					<option value="all">全部状态</option>
					<option value="0">正常</option>
					<option value="1">已停用</option>
				</select>
				<Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>刷新</Button>
			</div>
			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[900px] text-sm">
							<thead className="border-b bg-muted/40 text-left text-muted-foreground">
								<tr>{["用户", "业务 ID", "注册时间", "状态", "漫画项目", "积分", ""].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr>
							</thead>
							<tbody className="divide-y">
								{query.isLoading || query.isError || users.length === 0 ? (
									<tr><td colSpan={7} className="px-4"><QueryFeedback loading={query.isLoading} error={query.error} empty={!query.isLoading && !query.isError} /></td></tr>
								) : users.map((user) => (
									<tr key={user.bizId} className="hover:bg-muted/30">
										<td className="px-4 py-3"><div className="font-medium">{user.username?.trim() || "未设置昵称"}</div><div className="text-xs text-muted-foreground">{user.email}</div></td>
										<td className="px-4 py-3 font-mono text-xs">{user.bizId}</td>
										<td className="px-4 py-3">{formatManagerDate(user.createdAt)}</td>
										<td className="px-4 py-3"><StatusBadge status={user.status} /></td>
										<td className="px-4 py-3">{user.comicCount.toLocaleString()}</td>
										<td className="px-4 py-3">{user.creditBalance.toLocaleString()}</td>
										<td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={() => setSelectedBizId(user.bizId)}>详情</Button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
			{query.data && <ManagerPagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />}

			<Dialog open={Boolean(selectedBizId)} onOpenChange={(open) => { if (!open) setSelectedBizId(null); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>用户详情</DialogTitle>
						<DialogDescription>从漫画平台读取用户资料和关联统计。</DialogDescription>
					</DialogHeader>
					{detailQuery.isLoading ? <QueryFeedback loading /> : detailQuery.isError ? <QueryFeedback error={detailQuery.error} /> : detailQuery.data ? (
						<dl className="grid grid-cols-2 gap-4 text-sm">
							<dt className="text-muted-foreground">用户 ID</dt><dd>{detailQuery.data.id}</dd>
							<dt className="text-muted-foreground">业务 ID</dt><dd className="break-all font-mono text-xs">{detailQuery.data.bizId}</dd>
							<dt className="text-muted-foreground">昵称</dt><dd>{detailQuery.data.username?.trim() || "未设置"}</dd>
							<dt className="text-muted-foreground">邮箱</dt><dd className="break-all">{detailQuery.data.email}</dd>
							<dt className="text-muted-foreground">注册时间</dt><dd>{formatManagerDate(detailQuery.data.createdAt)}</dd>
							<dt className="text-muted-foreground">账号状态</dt><dd><StatusBadge status={detailQuery.data.status} /></dd>
							<dt className="text-muted-foreground">漫画项目数</dt><dd>{detailQuery.data.comicCount.toLocaleString()}</dd>
							<dt className="text-muted-foreground">积分余额</dt><dd>{detailQuery.data.creditBalance.toLocaleString()}</dd>
						</dl>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
