export type ManagerRole = "SUPER_ADMIN" | "ADMIN";

export interface ManagerPrincipal {
	userId: number;
	bizId: string;
	email: string;
	username?: string | null;
	role: ManagerRole;
}

export interface ManagerLoginResponse {
	sessionToken: string;
	admin: ManagerPrincipal;
}

export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	totalComics: number;
	activeComics: number;
	totalChapters: number;
	publishedChapters: number;
	registrationsLast7Days: number;
}

export interface UserSummary {
	id: number;
	bizId: string;
	email: string;
	username?: string | null;
	avatarUrl: string | null;
	status: number;
	createdAt: string;
	comicCount: number;
	creditBalance: number;
}

export interface ComicProjectSummary {
	bizId: string;
	userId: string;
	ownerEmail: string;
	ownerUsername?: string | null;
	title: string;
	description: string | null;
	coverUrl: string | null;
	status: number;
	chapterCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface ComicChapterSummary {
	bizId: string;
	title: string;
	description: string | null;
	coverUrl: string | null;
	orderIndex: number;
	publishStatus: number;
	status: number;
	createdAt: string;
	updatedAt: string;
}

export interface ComicProjectDetail {
	project: ComicProjectSummary;
	chapters: ComicChapterSummary[];
}

export interface ManagerAdminSummary {
	userId: number;
	email: string;
	username?: string | null;
	role: ManagerRole;
	createdAt: string;
}

export interface CreditGrantRequest {
	targetUserBizId: string;
	creditAmount: number;
	remark?: string;
	requestId: string;
}

export interface CreditGrantReceipt {
	targetUserBizId: string;
	targetEmail: string;
	creditAmount: number;
	balanceAfter: number;
}

export interface CreditGrantSummary {
	transactionId: number;
	targetUserBizId: string;
	targetEmail: string;
	targetUsername?: string | null;
	creditAmount: number;
	balanceAfter: number;
	remark?: string | null;
	operatorUserId?: number | null;
	operatorEmail?: string | null;
	createdAt: string;
}

export interface PageResult<T> {
	list: T[];
	total: number;
	page: number;
	pageSize: number;
}

export interface PageQuery {
	page: number;
	pageSize: number;
	keyword?: string;
	status?: 0 | 1;
}
