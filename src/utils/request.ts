import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useUserStore from "@/store/userStore";

export const http = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API || "/api",
	timeout: 15000,
	withCredentials: true,
});

http.interceptors.request.use((config) => {
	const token = useUserStore.getState().userToken.token;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const requestUrl = error.config?.url ?? "";
		if (error.response?.status === 401 && !requestUrl.endsWith("/manager/auth/login")) {
			useUserStore.getState().clearManagerSession();
		}
		return Promise.reject(error);
	},
);

class RequestClient {
	get<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "GET" });
	}

	post<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "POST" });
	}

	put<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PUT" });
	}

	patch<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "PATCH" });
	}

	delete<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: "DELETE" });
	}

	async request<T>(config: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await http.request<T>(config);
		return response.data;
	}
}

export function getRequestErrorMessage(error: unknown, fallback = "请求失败") {
	if (axios.isAxiosError<{ message?: string }>(error)) {
		return error.response?.data?.message || error.message || fallback;
	}
	return error instanceof Error ? error.message : fallback;
}

export default new RequestClient();
