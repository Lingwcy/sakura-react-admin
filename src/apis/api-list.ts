export const apiList = {
	manager: {
		health: "/health",
		login: "/manager/auth/login",
		currentAdmin: "/manager/auth/me",
		logout: "/manager/auth/logout",
		dashboard: "/manager/dashboard",
		users: "/manager/users",
		userDetail: "/manager/users/{bizId}",
		comics: "/manager/comics",
		comicDetail: "/manager/comics/{bizId}",
		admins: "/manager/admins",
		removeAdmin: "/manager/admins/{userId}",
	},
	weather: {
		getTodayWeather: "https://api.open-meteo.com/v1/forecast?latitude=30.67&longitude=104.07&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=Asia/Shanghai",
	},
};
