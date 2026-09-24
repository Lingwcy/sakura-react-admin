import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Icon } from "@iconify/react";
import { AuthRoute } from "@/components/auth-route";
import type { AppRouteObject } from "@/types/router";
import { ERROR_ROUTE } from "./error-routes";

const Layout = lazy(() => import("@/pages/Layout"));
const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const AdminUsers = lazy(() => import("@/pages/UserManagement/admin-user-management"));
const ManagerAdmins = lazy(() => import("@/pages/UserManagement/admin-management"));
const CreditGrants = lazy(() => import("@/pages/CreditManagement"));
const Invitations = lazy(() => import("@/pages/InvitationManagement"));
const ComicProjects = lazy(() => import("@/pages/Comics"));
const BarCharts = lazy(() => import("@/pages/Display/Echarts/bar-charts"));
const PieCharts = lazy(() => import("@/pages/Display/Echarts/pie-charts"));
const LineCharts = lazy(() => import("@/pages/Display/Echarts/line-charts"));
const ThemeColors = lazy(() => import("@/pages/Display/ThemeColors"));


type LazyPage = LazyExoticComponent<ComponentType>;

function pageRoute(
	path: string,
	key: string,
	label: string,
	Page: LazyPage,
	icon?: string,
): AppRouteObject {
	return {
		path,
		element: <Page />,
		meta: {
			key,
			label,
			...(icon ? { icon: <Icon icon={icon} /> } : {}),
		},
	};
}

function routeGroup(
	path: string,
	key: string,
	label: string,
	icon: string,
	order: number,
	defaultChild: string,
	children: AppRouteObject[],
): AppRouteObject {
	return {
		path,
		element: <Outlet />,
		meta: {
			key,
			label,
			icon: <Icon icon={icon} />,
			hideTab: true,
		},
		order,
		children: [
			{ index: true, element: <Navigate to={defaultChild} replace /> },
			...children,
		],
	};
}

/** Routes and sidebar navigation are both derived from this fixed route tree. */
export const STATIC_APP_ROUTES: AppRouteObject[] = [
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: (
			<AuthRoute>
				<Layout />
			</AuthRoute>
		),
		children: [
			{ index: true, element: <Navigate to="/home" replace /> },
			pageRoute("home", "/home", "首页", Home, "line-md:home"),
			routeGroup("usermanagement", "/usermanagement", "用户管理", "line-md:account", 2, "user", [
				pageRoute("user", "/usermanagement/user", "漫画用户", AdminUsers),
				pageRoute("invitations", "/usermanagement/invitations", "邀请关系", Invitations, "line-md:account-add"),
				pageRoute("admins", "/usermanagement/admins", "后台管理员", ManagerAdmins),
			]),
			routeGroup("content", "/content", "内容管理", "line-md:document-list", 3, "comics", [
				pageRoute("comics", "/content/comics", "漫画项目", ComicProjects),
			]),
			routeGroup("credits", "/credits", "积分管理", "line-md:star-alt", 4, "grants", [
				pageRoute("grants", "/credits/grants", "定向赠送", CreditGrants),
			]),
			routeGroup("display", "/display", "演示", "line-md:pause-to-play-transition", 12, "echarts", [
				routeGroup("echarts", "/display/echarts", "ECharts", "line-md:chart-multiple", 0, "barcharts", [
					pageRoute("barcharts", "/display/echarts/barcharts", "柱状图", BarCharts, "line-md:hash-small"),
					pageRoute("piecharts", "/display/echarts/piecharts", "饼图", PieCharts, "line-md:hash-small"),
					pageRoute("linecharts", "/display/echarts/linecharts", "折线图", LineCharts, "line-md:hash-small"),
				]),
				pageRoute("theme-color", "/display/theme-color", "主题色", ThemeColors, "line-md:mushroom-filled"),
			]),
		],
	},
	ERROR_ROUTE,
	{
		path: "*",
		element: <Navigate to="/404" replace />,
	},
];

const router = createBrowserRouter(STATIC_APP_ROUTES as RouteObject[]);

export default function Router() {
	return <RouterProvider router={router} />;
}
