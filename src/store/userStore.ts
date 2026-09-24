import { create } from "zustand";
import type { ManagerPrincipal } from "@/types/manager";
import type { UserToken } from "@/types/userType";

type Store = {
	userToken: UserToken;
	admin: ManagerPrincipal | null;
};

type Action = {
	setManagerSession: (token: string, admin: ManagerPrincipal) => void;
	setManagerAdmin: (admin: ManagerPrincipal) => void;
	clearManagerSession: () => void;
};

const STORAGE_KEY = "oolong-comics-manager-session";
const emptyToken: UserToken = { token: "", refresh_token: "" };

function readStoredSession(): Store {
	if (typeof window === "undefined") return { userToken: emptyToken, admin: null };

	try {
		const value = window.sessionStorage.getItem(STORAGE_KEY);
		if (!value) return { userToken: emptyToken, admin: null };
		const parsed = JSON.parse(value) as Partial<Store>;
		return {
			userToken: parsed.userToken?.token ? parsed.userToken : emptyToken,
			admin: parsed.admin ?? null,
		};
	} catch {
		return { userToken: emptyToken, admin: null };
	}
}

function persistSession(userToken: UserToken, admin: ManagerPrincipal | null) {
	if (typeof window === "undefined") return;
	if (!userToken.token || !admin) {
		window.sessionStorage.removeItem(STORAGE_KEY);
		return;
	}
	window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ userToken, admin }));
}

const useUserStore = create<Store & Action>()((set) => ({
	...readStoredSession(),
	setManagerSession: (token, admin) => {
		const userToken = { token, refresh_token: "" };
		persistSession(userToken, admin);
		set({ userToken, admin });
	},
	setManagerAdmin: (admin) => {
		const userToken = useUserStore.getState().userToken;
		persistSession(userToken, admin);
		set({ admin });
	},
	clearManagerSession: () => {
		persistSession(emptyToken, null);
		set({ userToken: emptyToken, admin: null });
	},
}));

export default useUserStore;
