import { BookOpen, Layers3, UserRoundPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeading, QueryFeedback } from "@/components/manager/manager-ui";
import { useDashboardStats } from "@/hooks/use-manager";

function MetricCard({ title, value, detail, icon: Icon }: {
	title: string;
	value: number;
	detail: string;
	icon: typeof Users;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value.toLocaleString()}</div>
				<p className="mt-1 text-xs text-muted-foreground">{detail}</p>
			</CardContent>
		</Card>
	);
}

export default function Home() {
	const query = useDashboardStats();
	const stats = query.data;

	return (
		<div className="mx-auto w-full max-w-7xl">
			<PageHeading
				title="管理概览"
				description="漫画平台用户、项目与章节的实时统计。"
				actions={<Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>刷新</Button>}
			/>
			{query.isLoading || query.isError ? (
				<Card><CardContent><QueryFeedback loading={query.isLoading} error={query.error} /></CardContent></Card>
			) : stats ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<MetricCard title="注册用户" value={stats.totalUsers} detail={`${stats.activeUsers.toLocaleString()} 个账号正常`} icon={Users} />
						<MetricCard title="漫画项目" value={stats.totalComics} detail={`${stats.activeComics.toLocaleString()} 个项目正常`} icon={BookOpen} />
						<MetricCard title="章节总数" value={stats.totalChapters} detail={`${stats.publishedChapters.toLocaleString()} 个章节已发布`} icon={Layers3} />
						<MetricCard title="近 7 天新增用户" value={stats.registrationsLast7Days} detail="按漫画平台注册时间统计" icon={UserRoundPlus} />
					</div>
					<Card className="mt-6">
						<CardHeader>
							<CardTitle>数据来源</CardTitle>
							<CardDescription>统计数据由管理台后端实时读取。</CardDescription>
						</CardHeader>
					</Card>
				</>
			) : null}
		</div>
	);
}
