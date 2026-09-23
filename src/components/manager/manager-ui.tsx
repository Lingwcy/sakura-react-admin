import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHeading({ title, description, actions }: {
	title: string;
	description?: string;
	actions?: ReactNode;
}) {
	return (
		<div className="mb-6 flex flex-wrap items-start justify-between gap-3">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
			</div>
			{actions}
		</div>
	);
}

export function QueryFeedback({ loading, error, empty = false }: {
	loading?: boolean;
	error?: unknown;
	empty?: boolean;
}) {
	if (loading) return <p className="py-10 text-center text-sm text-muted-foreground">正在加载…</p>;
	if (error) {
		const message = error instanceof Error ? error.message : "请求失败";
		return <p role="alert" className="py-10 text-center text-sm text-destructive">加载失败：{message}</p>;
	}
	if (empty) return <p className="py-10 text-center text-sm text-muted-foreground">暂无数据</p>;
	return null;
}

export function ManagerPagination({ page, pageSize, total, onPageChange }: {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-muted-foreground">
			<span>{total.toLocaleString()} 条记录 · 第 {page} / {totalPages} 页</span>
			<div className="flex gap-2">
				<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>上一页</Button>
				<Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>下一页</Button>
			</div>
		</div>
	);
}

export function formatManagerDate(value?: string | null) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function StatusBadge({ status }: { status: number }) {
	const active = status === 0;
	return (
		<span className={active
			? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
			: "inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"}>
			{active ? "正常" : "已下架 / 停用"}
		</span>
	);
}
