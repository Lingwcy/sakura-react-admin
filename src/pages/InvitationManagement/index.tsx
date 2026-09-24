import { useDeferredValue, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { Gift, Network, RefreshCw, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatManagerDate, ManagerPagination, PageHeading, QueryFeedback } from "@/components/manager/manager-ui";
import { useManagerInvitations } from "@/hooks/use-manager";
import { readChartPalette } from "@/utils/color";
import type { InvitationRelationship } from "@/types/manager";

const PAGE_SIZE = 20;

function compactUserLabel(username: string | null | undefined, email: string | null | undefined, userId: string) {
	const name = username?.trim() || email?.trim() || userId;
	const shortName = name.length > 16 ? `${name.slice(0, 15)}…` : name;
	return `${shortName} · ${userId.slice(-5)}`;
}

function buildInvitationGraph(rows: InvitationRelationship[]): EChartsOption {
	const people = new Map<string, {
		label: string;
		email: string | null | undefined;
		inviter: boolean;
		invitee: boolean;
		outgoing: number;
	}>();

	for (const row of rows) {
		const inviter = people.get(row.inviterUserId) ?? {
			label: compactUserLabel(row.inviterUsername, row.inviterEmail, row.inviterUserId),
			email: row.inviterEmail,
			inviter: false,
			invitee: false,
			outgoing: 0,
		};
		inviter.inviter = true;
		inviter.outgoing += 1;
		people.set(row.inviterUserId, inviter);

		const invitee = people.get(row.inviteeUserId) ?? {
			label: compactUserLabel(row.inviteeUsername, row.inviteeEmail, row.inviteeUserId),
			email: row.inviteeEmail,
			inviter: false,
			invitee: false,
			outgoing: 0,
		};
		invitee.invitee = true;
		people.set(row.inviteeUserId, invitee);
	}

	const palette = readChartPalette();
	const inviterColor = palette[0] || "#7c3aed";
	const inviteeColor = palette[4] || "#0ea5e9";
	const mixedRoleColor = palette[2] || "#f59e0b";
	const categories = [
		{ name: "邀请人", itemStyle: { color: inviterColor } },
		{ name: "新用户", itemStyle: { color: inviteeColor } },
		{ name: "同时邀请且被邀请", itemStyle: { color: mixedRoleColor } },
	];
	const data = [...people.entries()].map(([userId, person]) => ({
		id: userId,
		name: person.label,
		category: person.inviter && person.invitee ? 2 : person.inviter ? 0 : 1,
		value: person.outgoing,
		symbolSize: person.inviter ? Math.min(54, 34 + person.outgoing * 2) : 28,
		itemStyle: {
			color: person.inviter && person.invitee ? mixedRoleColor : person.inviter ? inviterColor : inviteeColor,
		},
	}));
	const links = rows.map((row) => ({
		source: row.inviterUserId,
		target: row.inviteeUserId,
		value: 1,
		name: `${row.inviterUsername || row.inviterUserId} 邀请 ${row.inviteeUsername || row.inviteeUserId}`,
	}));

	return {
		tooltip: { trigger: "item", formatter: "{b}" },
		legend: { top: 0, data: categories.map((category) => category.name) },
		series: [{
			type: "graph",
			layout: "force",
			data,
			links,
			categories,
			roam: true,
			draggable: true,
			focusNodeAdjacency: true,
			force: { repulsion: 280, edgeLength: [100, 170], gravity: 0.08 },
			label: { show: true, position: "right", fontSize: 11, width: 150, overflow: "truncate" },
			edgeSymbol: ["none", "arrow"],
			edgeSymbolSize: [4, 9],
			lineStyle: { color: "source", opacity: 0.55, curveness: 0.12, width: 1.5 },
			emphasis: { focus: "adjacency", lineStyle: { width: 3, opacity: 0.9 } },
		}],
	};
}

export default function InvitationManagement() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const keyword = useDeferredValue(search.trim());
	const query = useManagerInvitations({ page, pageSize: PAGE_SIZE, keyword: keyword || undefined });
	const overview = query.data;
	const relationships = overview?.relationships.list ?? [];
	const graphOption = useMemo(() => buildInvitationGraph(relationships), [relationships]);
	const stats = overview?.stats;

	function updateSearch(value: string) {
		setSearch(value);
		setPage(1);
	}

	const statCards = [
		{ label: "邀请关系", value: stats?.invitationCount, icon: Network, unit: "条" },
		{ label: "邀请人", value: stats?.inviterCount, icon: Users, unit: "人" },
		{ label: "受邀新用户", value: stats?.inviteeCount, icon: Users, unit: "人" },
		{ label: "邀请人奖励", value: stats?.inviterCreditTotal, icon: Gift, unit: "积分" },
		{ label: "新用户奖励", value: stats?.inviteeCreditTotal, icon: Gift, unit: "积分" },
	];

	return (
		<div className="mx-auto w-full max-w-7xl space-y-6">
			<PageHeading
				title="邀请关系"
				description="查询邀请人和受邀新用户的关系、兑换时间及奖励记录。顶部为全站统计，图表和明细受搜索、分页筛选。"
			/>

			<div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
				{statCards.map(({ label, value, icon: StatIcon, unit }) => (
					<Card key={label} className="gap-3 py-4">
						<CardContent className="flex items-center justify-between gap-3 px-4">
							<div className="min-w-0">
								<p className="truncate text-xs text-muted-foreground">{label}</p>
								<p className="mt-1 text-xl font-semibold tabular-nums">
									{value === undefined ? "—" : `${value.toLocaleString()} ${unit}`}
								</p>
							</div>
							<span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
								<StatIcon className="size-5" />
							</span>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<div className="relative min-w-56 flex-1 sm:max-w-md">
					<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => updateSearch(event.target.value)}
						placeholder="搜索邀请人、新用户、邮箱、用户 ID 或邀请码"
						className="pl-9"
					/>
				</div>
				<Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>
					<RefreshCw className={`size-4 ${query.isFetching ? "animate-spin" : ""}`} />
					刷新
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2"><Network className="size-4 text-primary" />邀请关系图</CardTitle>
					<CardDescription>图表展示当前搜索结果和分页中的关系；拖动节点可整理布局，滚轮或拖动可缩放、平移。</CardDescription>
				</CardHeader>
				<CardContent>
					{query.isLoading || query.isError || relationships.length === 0 ? (
						<QueryFeedback loading={query.isLoading} error={query.error} empty={!query.isLoading && !query.isError} />
					) : <ReactECharts option={graphOption} notMerge style={{ height: 440, width: "100%" }} />}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>邀请明细</CardTitle>
					<CardDescription>每一行代表一次成功兑换。邀请人奖励达到上限后，新用户仍可领取奖励。</CardDescription>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[1100px] text-sm">
							<thead className="border-y bg-muted/40 text-left text-muted-foreground">
								<tr>
									{["邀请人", "受邀新用户", "邀请码", "邀请人奖励", "新用户奖励", "兑换时间"].map((label) => (
										<th key={label} className="px-4 py-3 font-medium">{label}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y">
								{query.isLoading || query.isError || relationships.length === 0 ? (
									<tr><td colSpan={6} className="px-4"><QueryFeedback loading={query.isLoading} error={query.error} empty={!query.isLoading && !query.isError} /></td></tr>
								) : relationships.map((relationship) => (
									<tr key={relationship.inviteeUserId} className="hover:bg-muted/30">
										<td className="px-4 py-3">
											<div className="font-medium">{relationship.inviterUsername?.trim() || "未设置昵称"}</div>
											<div className="text-xs text-muted-foreground">{relationship.inviterEmail || relationship.inviterUserId}</div>
										</td>
										<td className="px-4 py-3">
											<div className="font-medium">{relationship.inviteeUsername?.trim() || "未设置昵称"}</div>
											<div className="text-xs text-muted-foreground">{relationship.inviteeEmail || relationship.inviteeUserId}</div>
										</td>
										<td className="px-4 py-3"><Badge variant="outline" className="font-mono tracking-wider">{relationship.code}</Badge></td>
										<td className="px-4 py-3 tabular-nums">{relationship.inviterCredit.toLocaleString()} 积分</td>
										<td className="px-4 py-3 tabular-nums">{relationship.inviteeCredit.toLocaleString()} 积分</td>
										<td className="px-4 py-3">{formatManagerDate(relationship.createdAt)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{overview && <ManagerPagination
				page={overview.relationships.page}
				pageSize={overview.relationships.pageSize}
				total={overview.relationships.total}
				onPageChange={setPage}
			/>}
		</div>
	);
}
