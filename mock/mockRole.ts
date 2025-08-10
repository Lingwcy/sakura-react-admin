export enum PermissionType {
	CATALOGUE = 0,
	MENU = 1,
	BUTTON = 2,
}

export enum BasicStatus {
	DISABLE = 0,
	ENABLE = 1,
}
const HERO_PERMISSION = {
	id: "7000",
	parentId: "",
	label: "首页",
	name: "首页",
	icon: "line-md:sun-rising-loop",
	type: PermissionType.CATALOGUE,
	route: "hero",
	order: 1,
	children: [
		{
			id: "7001",
			parentId: "7000",
			label: "关于项目",
			name: "关于项目",
			type: PermissionType.MENU,
			route: "about-project",
			component: "/Hero/about-project/index.tsx",
		},
	],
}
const SERVER_PERMISSION = {
	id: "1000",
	parentId: "",
	label: "服务器管理",
	name: "服务器管理",
	icon: "line-md:hazard-lights-filled-loop",
	type: PermissionType.CATALOGUE,
	route: "server",
	order: 3,
	children: [
		{
			id: "1001",
			parentId: "1000",
			label: "已收录",
			name: "已收录",
			type: PermissionType.MENU,
			route: "archive",
			component: "/Server/achrive-list/index.tsx",
		},
		{
			id: "1002",
			parentId: "1000",
			label: "待审核",
			name: "待审核",
			type: PermissionType.MENU,
			route: "review",
			component: "/Server/review-list/index.tsx",
		},
		{
			id: "1003",
			parentId: "1000",
			label: "黑名单",
			name: "黑名单",
			type: PermissionType.MENU,
			route: "baned",
			component: "/Server/baned-list/index.tsx",
		}
	],
};
const USER_PERMISSION = {
	id: "2000",
	parentId: "",
	label: "用户管理",
	name: "用户管理",
	icon: "line-md:account",
	type: PermissionType.CATALOGUE,
	route: "usermanagement",
	order: 2,
	children: [
		{
			id: "2001",
			parentId: "2000",
			label: "后台用户",
			name: "后台用户",
			type: PermissionType.MENU,
			route: "user",
			component: "/UserManagement/admin-user-management/index.tsx",
		},
		{
			id: "2002",
			parentId: "2000",
			label: "客户端用户",
			name: "客户端用户",
			type: PermissionType.MENU,
			route: "fontuser",
			component: "/UserManagement/font-user-management/index.tsx",
		},
	],
};
const PERMISSION_PERMISSION = {
	id: "3000",
	parentId: "",
	label: "权限管理",
	name: "权限管理",
	icon: "line-md:gauge-loop",
	type: PermissionType.CATALOGUE,
	route: "auth",
	order: 4,
	children: [
		{
			id: "3001",
			parentId: "3000",
			label: "后台动态路由权限",
			name: "后台动态路由权限",
			type: PermissionType.MENU,
			route: "permission",
			component: '/PermissionManagement/user-permission/index.tsx'
		},
	],
};
const COMPONENTS_PERMISSION = {
	id: "4000",
	parentId: "",
	label: "组件",
	name: "组件",
	icon: "line-md:document-add-twotone",
	type: PermissionType.CATALOGUE,
	route: "component",
	order: 5,
	children: [
		{
			id: "4001",
			parentId: "4000",
			label: "服务器卡片",
			name: "服务器卡片",
			type: PermissionType.MENU,
			route: "servercard",
			component: "/Component/server-card-playground.tsx",
		}
	],
};
const TOOLS_PERMISSION = {
	id: "5000",
	parentId: "",
	label: "工具",
	name: "工具",
	icon: "line-md:peanut",
	type: PermissionType.CATALOGUE,
	route: "tool",
	order: 6,
	children: [
		{
			id: "5001",
			parentId: "5000",
			label: "接口器",
			name: "接口器",
			type: PermissionType.MENU,
			route: "api",
			component: "/Tools/api-tool/index.tsx",
		}
	],
};
const CSSLAYOUT_PERMISSION = {
	id: "6000",
	parentId: "",
	label: "css靶场",
	name: "css靶场",
	icon: "line-md:sun-rising-loop",
	type: PermissionType.CATALOGUE,
	route: "cssplayground",
	order: 7,
	children: [
		{
			id: "6002",
			parentId: "6000",
			label: "二级加载动画",
			name: "二级加载动画",
			type: PermissionType.MENU,
			route: "loading-2",
			component: "/CssPlayground/border-loading-playground.tsx",
		},
	],
};


export const PERMISSION_LIST = [
	SERVER_PERMISSION,
	USER_PERMISSION,
	PERMISSION_PERMISSION,
	COMPONENTS_PERMISSION,
	TOOLS_PERMISSION,
	CSSLAYOUT_PERMISSION,
	HERO_PERMISSION,
];


const ADMIN_ROLE = {
	id: "1",
	name: "Admin",
	label: "admin",
	status: BasicStatus.ENABLE,
	order: 1,
	desc: "Super Admin",
	permission: PERMISSION_LIST,
};
const TEST_ROLE = {
	id: "2",
	name: "Test",
	label: "test",
	status: BasicStatus.ENABLE,
	order: 2,
	desc: "test",
	permission: [USER_PERMISSION, COMPONENTS_PERMISSION, TOOLS_PERMISSION],
};
export const ROLE_LIST = [ADMIN_ROLE, TEST_ROLE];

