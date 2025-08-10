import { LineLoading } from "@/components/loading";
import { useUserProfile } from "@/hooks/use-user";
import { flattenTrees } from "@/utils/tree";
import { isEmpty } from "ramda";
import { Suspense, lazy, useMemo } from "react";
import { Navigate, Outlet } from "react-router";
import { Permission, PermissionBasicStatus, PermissionType } from "@/types/roleType";
import { Icon } from "@iconify/react";
import { AppRouteObject } from "@/types/router";


// 动态批量导入
const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx");
const loadComponentFromPath = (path: string) => PAGES[`${ENTRY_PATH}${path}`];

/**
 * 对当前权限节点构建完整可用的路由
 * @param {Permission} permission - 当前权限节点
 * @param {Permission[]} flattenedPermissions - 拍平的全节点数组
 * @param {string[]} segments - 当前权限路由切片
 * @returns {string} 递归后的当前节点完整路由路径
 */
function buildCompleteRoute(
	permission: Permission,
	flattenedPermissions: Permission[],
	segments: string[] = [],
): string {
	// 将当前的权限路由切片添加到首部
	segments.unshift(permission.route);

	// 如果此时权限没有父节点，说明到达顶部
	if (!permission.parentId) {
		return `/${segments.join("/")}`;
	}

	// 找此权限节点的父节点
	const parent = flattenedPermissions.find((p) => p.id === permission.parentId);
	if (!parent) {
		console.warn(
			`没有找到 ${permission.label} 的父节点 ${permission.parentId} ，但${permission.label} 确实声明了指向此父节点:`,
		);
		return `/${segments.join("/")}`;
	}

	return buildCompleteRoute(parent, flattenedPermissions, segments);
}



/**
 * 基于 RouteObject 构建类型兼容的 AppRouteObject
 * @param permission 当前权限节点
 * @param completeRoute 当前权限节点的完整路由路径（RouteObject必须属性path）
 * @returns AppRouteObject
 */
const createBaseRoute = (permission: Permission, completeRoute: string): AppRouteObject => {
	const { route, label, icon, order, hide, status } = permission;

	const baseRoute: AppRouteObject = {
		path: route,
		meta: {
			label,
			key: completeRoute,
			hideMenu: !!hide,
			disabled: status === PermissionBasicStatus.DISABLE,
		},
	};

	if (order) baseRoute.order = order;
	if (baseRoute.meta) {
		if (icon) baseRoute.meta.icon = <Icon icon={icon} />;
	}

	return baseRoute;
};

const createCatalogueRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (baseRoute.meta) {
		baseRoute.meta.hideTab = true;
	}

	const { parentId, children = [] } = permission;
	// 没有上级目录的权限节点，为根目录，为子路由添加出口Outlet
	if (!parentId) {
		baseRoute.element = (
			<Suspense fallback={<LineLoading />}>
				<Outlet />
			</Suspense>
		);
	}
	// 将此权限目录的下的子权限做递归处理
	baseRoute.children = transformPermissionsToRoutes(children, flattenedPermissions);
	// 如果此目录下的children不为空，则将第一个子路由匹配为index路由
	// eg. '/server => /server/archive (index)'
	if (!isEmpty(children)) {
		baseRoute.children.unshift({
			index: true,
			element: <Navigate to={children[0].route} replace />,
		});
	}

	return baseRoute;
};

/**
 * 拼出完整 path → 生成路由骨架 → 按需挂懒加载组件 → 返回 AppRouteObject
 * @param permission
 * @param flattenedPermissions
 * @returns
 */
const createMenuRoute = (permission: Permission, flattenedPermissions: Permission[]): AppRouteObject => {
	const baseRoute = createBaseRoute(permission, buildCompleteRoute(permission, flattenedPermissions));

	if (permission.component) {
		const Element = lazy(loadComponentFromPath(permission.component) as () => Promise<{ default: React.ComponentType }>);
		baseRoute.element = (
			<Suspense fallback={<LineLoading />}>
				<Element />
			</Suspense>
		);

	}

	return baseRoute;
};

function transformPermissionsToRoutes(permissions: Permission[], flattenedPermissions: Permission[]): AppRouteObject[] {
	return permissions.map((permission) => {
		if (permission.type === PermissionType.CATALOGUE) {
			return createCatalogueRoute(permission, flattenedPermissions);
		}
		return createMenuRoute(permission, flattenedPermissions);
	});
}

// const ROUTE_MODE = import.meta.env.VITE_APP_ROUTER_MODE;
export function usePermissionRoutes() {
	const {userPermission} = useUserProfile()
	return useMemo(() => {
		if (!userPermission) return [];

		const flattenedPermissions = flattenTrees(userPermission);
		return transformPermissionsToRoutes(userPermission, flattenedPermissions);
	}, [userPermission]);
}
