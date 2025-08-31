import { lazy } from "react";
import { AuthRoute } from "@/components/auth-route";
import { usePermissionRoutes } from "./hooks/use-permission-routes";
import { Navigate, RouteObject, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppRouteObject } from "@/types/router";
import { ERROR_ROUTE } from './error-routes'
// 懒加载关键组件
const Layout = lazy(() => import("@/pages/Layout"));
const Login = lazy(() => import("@/pages/Login"));

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const PUBLIC_ROUTE: AppRouteObject = {
	path: "/login",
	element: (
		<Login />
	),
};

const NO_MATCHED_ROUTE: AppRouteObject = {
	path: "*",
	element: <Navigate to="/404" replace />,
};

export default function Router() {
	const permissionRoutes = usePermissionRoutes();
	const PROTECTED_ROUTE: AppRouteObject = {
		path: "/",
		element: (
			<AuthRoute>
				<Layout />
			</AuthRoute>
		),
		children: [
			{
				index: true,
				element: <Navigate to={HOMEPAGE} replace />
			},
			...permissionRoutes
		],
	};

	const routes = [NO_MATCHED_ROUTE, PUBLIC_ROUTE, PROTECTED_ROUTE, ERROR_ROUTE] as RouteObject[];

	const router = createBrowserRouter(routes);

	return <RouterProvider router={router} />;
}
