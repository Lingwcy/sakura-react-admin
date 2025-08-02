import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStore } from "@/store";
import { useUserToken } from "@/hooks/use-user";
import { useNavigate } from "react-router";

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})

request.interceptors.request.use((config) => {
	/*
		直接访问: getState() 可以在任何地方调用，不需要在 React 组件或 hook 中
	*/
    const token = useUserStore.getState().userToken.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

request.interceptors.response.use((response) => {
    return response
}, (error: AxiosError) => {
	if(error.response?.status ===401){
		const {clearUserToken} = useUserToken();
		const navigate = useNavigate()
		clearUserToken()
		navigate('/')
	}
    return Promise.reject(error)
})

class requestClient {
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

	request<T>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			request
				.request(config)
				.then((res: AxiosResponse) => {
					resolve(res.data);
				})
				.catch((e: AxiosError) => {
					if (e.response && e.response.data) {
						reject({
							...e,
							data: e.response.data,
							message : "request传递了一个错误"
						});
					} else {
						reject(e);
					}
				});
		});
	}
}


export default new requestClient();