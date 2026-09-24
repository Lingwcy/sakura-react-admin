import { useDeferredValue, useState, type FormEvent } from "react";
import { Gift, RefreshCw, Search, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatManagerDate, ManagerPagination, PageHeading, QueryFeedback } from "@/components/manager/manager-ui";
import { useGrantManagerCredits, useManagerCreditGrants, useManagerUsers } from "@/hooks/use-manager";
import type { UserSummary } from "@/types/manager";
import { getRequestErrorMessage } from "@/utils/request";

const HISTORY_PAGE_SIZE = 20;
const RECIPIENT_PAGE_SIZE = 8;

function newRequestId() {
	return window.crypto.randomUUID();
}

export default function CreditManagement() {
	const [recipientSearch, setRecipientSearch] = useState("");
	const [selectedRecipient, setSelectedRecipient] = useState<UserSummary | null>(null);
	const [creditAmount, setCreditAmount] = useState("");
	const [remark, setRemark] = useState("");
	const [requestId, setRequestId] = useState(newRequestId);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [historySearch, setHistorySearch] = useState("");
	const [historyPage, setHistoryPage] = useState(1);
	const recipientKeyword = useDeferredValue(recipientSearch.trim());
	const historyKeyword = useDeferredValue(historySearch.trim());
	const recipientQuery = useManagerUsers(
		{ page: 1, pageSize: RECIPIENT_PAGE_SIZE, keyword: recipientKeyword, status: 0 },
		recipientKeyword.length >= 2 && !selectedRecipient,
	);
	const historyQuery = useManagerCreditGrants({
		page: historyPage,
		pageSize: HISTORY_PAGE_SIZE,
		keyword: historyKeyword || undefined,
	});
	const grantMutation = useGrantManagerCredits();
	const recipients = recipientQuery.data?.list ?? [];
	const amount = Number(creditAmount);
	const amountIsValid = Number.isSafeInteger(amount) && amount > 0;

	function updateHistorySearch(value: string) {
		setHistorySearch(value);
		setHistoryPage(1);
	}

	function chooseRecipient(user: UserSummary) {
		setSelectedRecipient(user);
		setRecipientSearch("");
		setCreditAmount("");
		setRemark("");
		setRequestId(newRequestId());
	}

	function changeRecipient() {
		setSelectedRecipient(null);
		setCreditAmount("");
		setRemark("");
		setRequestId(newRequestId());
	}

	function handleStartGrant(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedRecipient) {
			toast.error("请先选择一位有效用户");
			return;
		}
		if (!amountIsValid) {
			toast.error("赠送积分必须是正整数");
			return;
		}
		setConfirmOpen(true);
	}

	async function handleConfirmGrant() {
		if (!selectedRecipient || !amountIsValid) return;
		try {
			const receipt = await grantMutation.mutateAsync({
				targetUserId: selectedRecipient.userId,
				creditAmount: amount,
				remark: remark.trim(),
				requestId,
			});
			setSelectedRecipient((current) => current?.userId === receipt.targetUserId
				? { ...current, creditBalance: receipt.balanceAfter }
				: current);
			setConfirmOpen(false);
			setCreditAmount("");
			setRemark("");
			setRequestId(newRequestId());
			toast.success(`已向 ${receipt.targetEmail} 赠送 ${receipt.creditAmount.toLocaleString()} 积分`);
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "积分赠送失败"));
		}
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-8">
			<PageHeading title="积分定向赠送" description="向指定的漫画平台用户发放积分，并查看赠送流水。每笔发放都会记录操作账号、余额快照和备注。" />

			<Card>
				<CardContent className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:p-6">
					<section className="space-y-4">
						<div className="flex items-center gap-2 font-medium"><Gift className="size-4 text-primary" />赠送积分</div>
						{selectedRecipient ? (
							<div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-4">
								<div className="min-w-0">
									<div className="font-medium">{selectedRecipient.username?.trim() || "未设置昵称"}</div>
									<div className="break-all text-sm text-muted-foreground">{selectedRecipient.email}</div>
									<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
										<Badge variant="outline">ID {selectedRecipient.userId}</Badge>
										<span>当前余额 {selectedRecipient.creditBalance.toLocaleString()} 积分</span>
									</div>
								</div>
								<Button type="button" size="sm" variant="outline" onClick={changeRecipient}>更换用户</Button>
							</div>
						) : (
							<div className="space-y-3">
								<label htmlFor="credit-recipient-search" className="text-sm font-medium">查找用户</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="credit-recipient-search"
										value={recipientSearch}
										onChange={(event) => setRecipientSearch(event.target.value)}
										placeholder="搜索邮箱、昵称或用户 ID（至少 2 个字符）"
										className="pl-9"
									/>
								</div>
								{recipientKeyword.length < 2 ? (
									<p className="text-xs text-muted-foreground">只显示状态正常的用户。</p>
								) : (
									<div className="max-h-56 overflow-y-auto rounded-md border">
										{recipientQuery.isLoading || recipientQuery.isError || recipients.length === 0 ? (
											<div className="px-3"><QueryFeedback loading={recipientQuery.isLoading} error={recipientQuery.error} empty={!recipientQuery.isLoading && !recipientQuery.isError} /></div>
										) : recipients.map((user) => (
											<button key={user.userId} type="button" onClick={() => chooseRecipient(user)} className="flex w-full items-center justify-between gap-3 border-b p-3 text-left last:border-b-0 hover:bg-muted/40">
												<span className="min-w-0"><span className="block truncate font-medium">{user.username?.trim() || "未设置昵称"}</span><span className="block truncate text-xs text-muted-foreground">{user.email} · {user.userId}</span></span>
												<span className="shrink-0 text-xs text-muted-foreground">{user.creditBalance.toLocaleString()} 积分</span>
											</button>
										))}
									</div>
								)}
							</div>
						)}

						<form onSubmit={handleStartGrant} className="space-y-4 border-t pt-4">
							<div className="space-y-2">
								<label htmlFor="credit-amount" className="text-sm font-medium">赠送数量</label>
								<div className="relative">
									<Wallet className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input id="credit-amount" type="number" min="1" step="1" inputMode="numeric" value={creditAmount} onChange={(event) => setCreditAmount(event.target.value)} className="pl-9" placeholder="输入正整数" required />
								</div>
							</div>
							<div className="space-y-2">
								<label htmlFor="credit-remark" className="text-sm font-medium">赠送备注 <span className="font-normal text-muted-foreground">（可选，用户可见）</span></label>
								<Textarea id="credit-remark" value={remark} onChange={(event) => setRemark(event.target.value)} maxLength={512} placeholder="例如：活动奖励" />
							</div>
							<Button type="submit" disabled={!selectedRecipient || !amountIsValid || grantMutation.isPending}>
								<Gift className="size-4" />确认赠送
							</Button>
						</form>
					</section>

					<aside className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
						<h2 className="mb-2 font-medium text-foreground">赠送记录说明</h2>
						<ul className="list-disc space-y-2 pl-5">
							<li>赠送仅面向状态正常的漫画平台用户。</li>
							<li>赠送积分会增加用户可用余额，不计入购买积分。</li>
							<li>每笔赠送都会写入不可变积分流水，记录操作账号与赠送后余额。</li>
							<li>重复提交同一请求不会重复入账。</li>
						</ul>
					</aside>
				</CardContent>
			</Card>

			<section>
				<PageHeading title="赠送流水" description="搜索用户、业务 ID 或备注；记录包含目标余额和操作账号。" actions={<Button variant="outline" onClick={() => void historyQuery.refetch()} disabled={historyQuery.isFetching}><RefreshCw className="size-4" />刷新</Button>} />
				<div className="mb-4 relative min-w-56 sm:max-w-sm">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input value={historySearch} onChange={(event) => updateHistorySearch(event.target.value)} placeholder="搜索目标邮箱、昵称、业务 ID 或备注" className="pl-9" />
				</div>
				<Card>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full min-w-[1050px] text-sm">
								<thead className="border-b bg-muted/40 text-left text-muted-foreground"><tr>{["目标用户", "赠送积分", "赠送后余额", "备注", "操作人", "时间"].map((label) => <th key={label} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
								<tbody className="divide-y">
									{historyQuery.isLoading || historyQuery.isError || !historyQuery.data?.list.length ? (
										<tr><td colSpan={6} className="px-4"><QueryFeedback loading={historyQuery.isLoading} error={historyQuery.error} empty={!historyQuery.isLoading && !historyQuery.isError} /></td></tr>
									) : historyQuery.data.list.map((grant) => (
										<tr key={grant.transactionId} className="hover:bg-muted/30">
											<td className="px-4 py-3"><div className="font-medium">{grant.targetUsername?.trim() || "未设置昵称"}</div><div className="text-xs text-muted-foreground">{grant.targetEmail}</div><div className="font-mono text-[11px] text-muted-foreground">{grant.targetUserId}</div></td>
											<td className="px-4 py-3 font-medium text-emerald-700 dark:text-emerald-400">+{grant.creditAmount.toLocaleString()}</td>
											<td className="px-4 py-3">{grant.balanceAfter.toLocaleString()}</td>
											<td className="max-w-xs whitespace-pre-wrap px-4 py-3">{grant.remark || "—"}</td>
											<td className="px-4 py-3">{grant.operatorEmail || (grant.operatorUserId ? `用户 ${grant.operatorUserId}` : "—")}</td>
											<td className="px-4 py-3 whitespace-nowrap">{formatManagerDate(grant.createdAt)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
				{historyQuery.data && <ManagerPagination page={historyQuery.data.page} pageSize={historyQuery.data.pageSize} total={historyQuery.data.total} onPageChange={setHistoryPage} />}
			</section>

			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>确认定向赠送</DialogTitle>
						<DialogDescription>
							将向 {selectedRecipient?.email} 赠送 {amountIsValid ? amount.toLocaleString() : "0"} 积分，赠送后余额约为 {selectedRecipient && amountIsValid ? (selectedRecipient.creditBalance + amount).toLocaleString() : "—"}。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} disabled={grantMutation.isPending}>取消</Button>
						<Button type="button" onClick={() => void handleConfirmGrant()} disabled={grantMutation.isPending}>
							{grantMutation.isPending ? "赠送中…" : "确认发放"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
