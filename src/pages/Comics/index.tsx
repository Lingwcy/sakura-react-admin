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
import { useManagerComic, useManagerComics } from "@/hooks/use-manager";

const PAGE_SIZE = 20;

export default function ComicProjects() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
	const keyword = useDeferredValue(search.trim());
	const status = statusFilter === "all" ? undefined : Number(statusFilter) as 0 | 1;
	const query = useManagerComics({ page, pageSize: PAGE_SIZE, keyword, status });
	const detailQuery = useManagerComic(selectedBizId);
	const comics = query.data?.list ?? [];

	function updateSearch(value: string) {
		setSearch(value);
		setPage(1);
	}

	function updateStatus(value: string) {
		setStatusFilter(value);
		setPage(1);
	}

	const project = detailQuery.data?.project;

	return (
		<div className="mx-auto w-full max-w-7xl">
			<PageHeading title="漫画项目" description="查询漫画项目、所有者与章节目录。当前后端仅开放只读管理接口。" />
			<div className="mb-4 flex flex-wrap gap-3">
				<div className="relative min-w-56 flex-1 sm:max-w-sm">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="搜索标题、描述或业务 ID" className="pl-9" />
				</div>
				<select className="h-9 rounded-md border bg-background px-3 text-sm" value={statusFilter} onChange={(event) => updateStatus(event.target.value)} aria-label="筛选项目状态">
					<option value="all">全部状态</option>
					<option value="0">正常</option>
					<option value="1">已下架</option>
				</select>
				<Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>刷新</Button>
			</div>
			<Card>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[900px] text-sm">
							<thead className="border-b bg-muted/40 text-left text-muted-foreground">
								<tr>{["项目", "作者", "业务 ID", "状态", "章节", "更新时间", ""].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr>
							</thead>
							<tbody className="divide-y">
								{query.isLoading || query.isError || comics.length === 0 ? (
									<tr><td colSpan={7} className="px-4"><QueryFeedback loading={query.isLoading} error={query.error} empty={!query.isLoading && !query.isError} /></td></tr>
								) : comics.map((comic) => (
									<tr key={comic.bizId} className="hover:bg-muted/30">
										<td className="px-4 py-3"><div className="font-medium">{comic.title}</div><div className="max-w-xs truncate text-xs text-muted-foreground">{comic.description || "暂无简介"}</div></td>
										<td className="px-4 py-3"><div>{comic.ownerUsername?.trim() || "未设置昵称"}</div><div className="text-xs text-muted-foreground">{comic.ownerEmail}</div></td>
										<td className="px-4 py-3 font-mono text-xs">{comic.bizId}</td>
										<td className="px-4 py-3"><StatusBadge status={comic.status} /></td>
										<td className="px-4 py-3">{comic.chapterCount.toLocaleString()}</td>
										<td className="px-4 py-3">{formatManagerDate(comic.updatedAt)}</td>
										<td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={() => setSelectedBizId(comic.bizId)}>章节详情</Button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
			{query.data && <ManagerPagination page={query.data.page} pageSize={query.data.pageSize} total={query.data.total} onPageChange={setPage} />}

			<Dialog open={Boolean(selectedBizId)} onOpenChange={(open) => { if (!open) setSelectedBizId(null); }}>
				<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle>{project?.title || "漫画项目详情"}</DialogTitle>
						<DialogDescription>项目资料和章节目录。</DialogDescription>
					</DialogHeader>
					{detailQuery.isLoading ? <QueryFeedback loading /> : detailQuery.isError ? <QueryFeedback error={detailQuery.error} /> : detailQuery.data ? (
						<div className="space-y-5">
							<dl className="grid gap-3 text-sm sm:grid-cols-2">
								<div><dt className="text-muted-foreground">业务 ID</dt><dd className="break-all font-mono text-xs">{project?.bizId}</dd></div>
								<div><dt className="text-muted-foreground">作者</dt><dd>{project?.ownerUsername?.trim() || "未设置昵称"} · {project?.ownerEmail}</dd></div>
								<div><dt className="text-muted-foreground">项目状态</dt><dd><StatusBadge status={project?.status ?? 1} /></dd></div>
								<div><dt className="text-muted-foreground">创建时间</dt><dd>{formatManagerDate(project?.createdAt)}</dd></div>
								<div className="sm:col-span-2"><dt className="text-muted-foreground">简介</dt><dd className="whitespace-pre-wrap">{project?.description || "暂无简介"}</dd></div>
							</dl>
							<div>
								<h3 className="mb-2 font-medium">章节（{detailQuery.data.chapters.length}）</h3>
								<div className="overflow-x-auto rounded-md border">
									<table className="w-full min-w-[600px] text-sm">
										<thead className="border-b bg-muted/40 text-left text-muted-foreground"><tr>{["顺序", "章节", "发布状态", "更新时间"].map((label) => <th key={label} className="px-3 py-2 font-medium">{label}</th>)}</tr></thead>
										<tbody className="divide-y">
											{detailQuery.data.chapters.length ? detailQuery.data.chapters.map((chapter) => (
												<tr key={chapter.bizId}><td className="px-3 py-2">{chapter.orderIndex}</td><td className="px-3 py-2"><div>{chapter.title}</div><div className="text-xs text-muted-foreground">{chapter.description || ""}</div></td><td className="px-3 py-2">{chapter.publishStatus}</td><td className="px-3 py-2">{formatManagerDate(chapter.updatedAt)}</td></tr>
											)) : <tr><td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">暂无章节</td></tr>}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
