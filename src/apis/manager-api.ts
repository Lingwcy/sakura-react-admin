import type { AxiosResponse } from "axios";
import { http } from "@/utils/request";
import type {
	ComicProjectDetail,
	ComicProjectSummary,
	CreditGrantRequest,
	CreditGrantReceipt,
	CreditGrantSummary,
	DashboardStats,
	ManagerAdminSummary,
	ManagerLoginResponse,
	ManagerPrincipal,
	PageQuery,
	PageResult,
	UserSummary,
} from "@/types/manager";

interface ApiResponse<T> {
	code: number;
	message: string;
	data: T;
}

function unwrap<T>(response: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
	return response.then(({ data }) => {
		if (data.code !== 0) throw new Error(data.message || "管理后台请求失败");
		return data.data;
	});
}

function pageParams({ page, pageSize, keyword, status }: PageQuery) {
	return {
		page,
		pageSize,
		...(keyword?.trim() ? { keyword: keyword.trim() } : {}),
		...(status === undefined ? {} : { status }),
	};
}

export const managerApi = {
	login: (credentials: { email: string; password: string }) =>
		unwrap(http.post<ApiResponse<ManagerLoginResponse>>("/manager/auth/login", credentials)),
	me: () => unwrap(http.get<ApiResponse<ManagerPrincipal>>("/manager/auth/me")),
	logout: () => unwrap(http.post<ApiResponse<boolean>>("/manager/auth/logout")),
	dashboard: () => unwrap(http.get<ApiResponse<DashboardStats>>("/manager/dashboard")),
	users: (params: PageQuery) =>
		unwrap(http.get<ApiResponse<PageResult<UserSummary>>>("/manager/users", { params: pageParams(params) })),
	user: (userId: string) =>
		unwrap(http.get<ApiResponse<UserSummary>>(`/manager/users/${encodeURIComponent(userId)}`)),
	comics: (params: PageQuery) =>
		unwrap(http.get<ApiResponse<PageResult<ComicProjectSummary>>>("/manager/comics", { params: pageParams(params) })),
	comic: (bizId: string) =>
		unwrap(http.get<ApiResponse<ComicProjectDetail>>(`/manager/comics/${encodeURIComponent(bizId)}`)),
	creditGrants: (params: Pick<PageQuery, "page" | "pageSize" | "keyword">) =>
		unwrap(http.get<ApiResponse<PageResult<CreditGrantSummary>>>("/manager/credit-grants", { params })),
	grantCredits: (request: CreditGrantRequest) =>
		unwrap(http.post<ApiResponse<CreditGrantReceipt>>("/manager/credit-grants", request)),
	admins: () => unwrap(http.get<ApiResponse<ManagerAdminSummary[]>>("/manager/admins")),
	addAdmin: (email: string) =>
		unwrap(http.post<ApiResponse<ManagerAdminSummary[]>>("/manager/admins", { email })),
	removeAdmin: (userId: string) =>
		unwrap(http.delete<ApiResponse<boolean>>(`/manager/admins/${encodeURIComponent(userId)}`)),
	health: () => unwrap(http.get<ApiResponse<{ service: string; status: string }>>("/health")),
};
