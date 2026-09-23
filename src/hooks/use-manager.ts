import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managerApi } from "@/apis/manager-api";
import type { PageQuery } from "@/types/manager";
import useUserStore from "@/store/userStore";

export const managerQueryKeys = {
	me: ["manager", "me"] as const,
	dashboard: ["manager", "dashboard"] as const,
	users: (params: PageQuery) => ["manager", "users", params] as const,
	user: (bizId: string) => ["manager", "user", bizId] as const,
	comics: (params: PageQuery) => ["manager", "comics", params] as const,
	comic: (bizId: string) => ["manager", "comic", bizId] as const,
	creditGrants: (params: Pick<PageQuery, "page" | "pageSize" | "keyword">) => ["manager", "credit-grants", params] as const,
	admins: ["manager", "admins"] as const,
};

export function useManagerLogin() {
	const queryClient = useQueryClient();
	const setManagerSession = useUserStore((state) => state.setManagerSession);
	return useMutation({
		mutationFn: managerApi.login,
		onSuccess: ({ sessionToken, admin }) => {
			setManagerSession(sessionToken, admin);
			queryClient.setQueryData(managerQueryKeys.me, admin);
		},
	});
}

export function useCurrentManager() {
	const token = useUserStore((state) => state.userToken.token);
	const setManagerAdmin = useUserStore((state) => state.setManagerAdmin);
	return useQuery({
		queryKey: managerQueryKeys.me,
		queryFn: async () => {
			const admin = await managerApi.me();
			setManagerAdmin(admin);
			return admin;
		},
		enabled: Boolean(token),
		retry: false,
		staleTime: 0,
		refetchOnWindowFocus: false,
	});
}

export function useManagerLogout() {
	const queryClient = useQueryClient();
	const clearSession = useUserStore((state) => state.clearManagerSession);
	return useMutation({
		mutationFn: managerApi.logout,
		onSettled: () => {
			clearSession();
			queryClient.clear();
		},
	});
}

export function useDashboardStats() {
	return useQuery({
		queryKey: managerQueryKeys.dashboard,
		queryFn: managerApi.dashboard,
	});
}

export function useManagerUsers(params: PageQuery, enabled = true) {
	return useQuery({
		queryKey: managerQueryKeys.users(params),
		queryFn: () => managerApi.users(params),
		enabled,
		placeholderData: (previousData) => previousData,
	});
}

export function useManagerUser(bizId: string | null) {
	return useQuery({
		queryKey: managerQueryKeys.user(bizId ?? ""),
		queryFn: () => managerApi.user(bizId!),
		enabled: Boolean(bizId),
	});
}

export function useManagerComics(params: PageQuery) {
	return useQuery({
		queryKey: managerQueryKeys.comics(params),
		queryFn: () => managerApi.comics(params),
		placeholderData: (previousData) => previousData,
	});
}

export function useManagerComic(bizId: string | null) {
	return useQuery({
		queryKey: managerQueryKeys.comic(bizId ?? ""),
		queryFn: () => managerApi.comic(bizId!),
		enabled: Boolean(bizId),
	});
}

export function useManagerCreditGrants(params: Pick<PageQuery, "page" | "pageSize" | "keyword">) {
	return useQuery({
		queryKey: managerQueryKeys.creditGrants(params),
		queryFn: () => managerApi.creditGrants(params),
		placeholderData: (previousData) => previousData,
	});
}

export function useGrantManagerCredits() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: managerApi.grantCredits,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["manager", "credit-grants"] });
			queryClient.invalidateQueries({ queryKey: ["manager", "users"] });
		},
	});
}

export function useManagerAdmins(enabled = true) {
	return useQuery({
		queryKey: managerQueryKeys.admins,
		queryFn: managerApi.admins,
		enabled,
	});
}

export function useAddManagerAdmin() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: managerApi.addAdmin,
		onSuccess: (admins) => queryClient.setQueryData(managerQueryKeys.admins, admins),
	});
}

export function useRemoveManagerAdmin() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: managerApi.removeAdmin,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: managerQueryKeys.admins }),
	});
}
