export interface Permission {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: PermissionBasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	children?: Permission[];
}
function PermisionTree2List(permissionTree: Permission[]) {
	const list: Omit<Permission, 'children'>[] = []

	function traverse(node: Permission[]) {
		node.forEach((item) => {
			// 非破坏式：不 delete children，拷贝后再压入
			const { children, ...rest } = item
			list.push(rest as Omit<Permission, 'children'>)
			if (children && children.length) {
				traverse(children)
			}
		})
	}

	traverse(permissionTree)
	return list
}
export enum PermissionType {
	CATALOGUE = 0,
	MENU = 1,
	BUTTON = 2,
}

export enum PermissionBasicStatus {
	DISABLE = 0,
	ENABLE = 1,
}

const DATA_SCREEN_PERMISSION = {
	id: "8000",
	parentId: "",
	label: "数据大屏",
	name: "数据大屏",
	icon: "line-md:monitor-screenshot",
	type: PermissionType.MENU,
	route: "screen",
	order: 1,
	component: "/DataScreen/index.tsx",
}

const HERO_PERMISSION = {
	id: "7000",
	parentId: "",
	label: "项目信息",
	name: "项目信息",
	icon: "line-md:reddit-circle-loop",
	type: PermissionType.CATALOGUE,
	route: "hero",
	order: 100,
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

const MENU_PERMISSION = {
	id: "9000",
	parentId: "",
	label: "多级菜单",
	name: "多级菜单",
	icon: "line-md:menu-fold-right",
	type: PermissionType.CATALOGUE,
	route: "multi",
	order: 100,
	children: [
		{
			id: "9001",
			parentId: "9000",
			icon: "line-md:chevron-small-triple-left",
			label: "菜单1",
			name: "菜单1",
			type: PermissionType.CATALOGUE,
			route: "first",
			children: [
				{
					id: "9011",
					parentId: "9001",
					label: "菜单1.1",
					icon: "line-md:chevron-small-triple-left",
					name: "菜单1.1",
					type: PermissionType.MENU,
					route: "first-one",
					component: "/MultiLevelMenu/FirstMenu/first-one.tsx",
				},
				{
					id: "9012",
					parentId: "9001",
					label: "菜单1.2",
					icon: "line-md:chevron-small-triple-left",
					name: "菜单1.2",
					type: PermissionType.CATALOGUE,
					route: "first-two",
					children: [
						{
							id: "9112",
							parentId: "9012",
							label: "菜单1.2.1",
							icon: "line-md:chevron-small-triple-left",
							name: "菜单1.2.1",
							type: PermissionType.MENU,
							route: "first-two-one",
							component: "/MultiLevelMenu/FirstMenu/FirstTwoMenu/first-two-one.tsx",
						},
					]
				},
			],
		},
		{
			id: "9002",
			parentId: "9000",
			icon: "line-md:chevron-small-triple-left",
			label: "菜单2",
			name: "菜单2",
			type: PermissionType.CATALOGUE,
			route: "secound",
			children: [
				{
					id: "9021",
					parentId: "9002",
					label: "菜单2.1",
					icon: "line-md:chevron-small-triple-left",
					name: "菜单2.1",
					type: PermissionType.MENU,
					route: "first-one",
					component: "/MultiLevelMenu/SecoundMenu/secound-one.tsx",
				},
			],
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
		{
			id: "3002",
			parentId: "3000",
			label: "角色",
			name: "角色",
			type: PermissionType.MENU,
			route: "role",
			component: '/PermissionManagement/user-role/index.tsx'
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
		},
		{
			id: "4002",
			parentId: "4000",
			label: "权限选择树",
			name: "权限选择树",
			type: PermissionType.MENU,
			route: "permission-select-tree",
			component: "/Component/permissiom-select-tree.tsx",
		},
		{
			id: "4003",
			parentId: "4000",
			label: "404",
			name: "404",
			type: PermissionType.MENU,
			route: "page-not-found",
			component: "/Component/page-not-found-test.tsx",
		},
		{
			id: "4004",
			parentId: "4000",
			label: "403",
			name: "403",
			type: PermissionType.MENU,
			route: "page-not-auth",
			component: "/Component/page-not-auth-test.tsx",
		},
		{
			id: "4005",
			parentId: "4000",
			label: "500",
			name: "500",
			type: PermissionType.MENU,
			route: "page-server-error",
			component: "/Component/page-server-error-test.tsx",
		},
		{
			id: "4006",
			parentId: "4000",
			label: "布局样式缩略",
			name: "布局样式缩略",
			type: PermissionType.MENU,
			route: "app-layout-test",
			component: "/Component/app-layout-test.tsx",
		},
		{
			id: "4007",
			parentId: "4000",
			label: "ECharts",
			name: "ECharts",
			type: PermissionType.MENU,
			route: "charts",
			component: "/Component/charts.tsx",
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
const AI_PERMISSION = {
	id: "11000",
	parentId: "",
	label: "AI",
	name: "AI",
	icon: "line-md:gauge-loop",
	type: PermissionType.CATALOGUE,
	route: "display",
	order: 13,
	children: [
		{
			id: "11001",
			parentId: "11000",
			label: "对话",
			name: "对话",
			type: PermissionType.MENU,
			route: "chat",
			component: "/AI/index.tsx",
		},
		{
			id: "11002",
			parentId: "11000",
			label: "模型提供商",
			name: "模型提供商",
			type: PermissionType.MENU,
			route: "provider",
			component: "/AI/ai-model-provider.tsx",
		},
		{
			id: "11003",
			parentId: "11000",
			label: "设置",
			name: "设置",
			type: PermissionType.MENU,
			route: "setting",
			component: "/AI/setting.tsx",
		},
	]
}
const PLAY_PERMISSION = {
	id: "10000",
	parentId: "",
	label: "演示",
	name: "演示",
	icon: "line-md:pause-to-play-transition",
	type: PermissionType.CATALOGUE,
	route: "display",
	order: 12,
	children: [
		{
			id: "10001",
			parentId: "10000",
			label: "ECharts",
			name: "ECharts",
			type: PermissionType.CATALOGUE,
			route: "echarts",
			children: [
				{
					id: "10011",
					parentId: "10001",
					label: "柱状图",
					name: "柱状图",
					icon: "line-md:hash-small",
					type: PermissionType.MENU,
					route: "barcharts",
					component: "/Display/Echarts/bar-charts.tsx",
					order: 1,
				},
				{
					id: "10012",
					parentId: "10001",
					label: "饼图",
					name: "饼图",
					icon: "line-md:hash-small",
					type: PermissionType.MENU,
					route: "piecharts",
					component: "/Display/Echarts/pie-charts.tsx",
					order: 1,
				},
				{
					id: "10013",
					parentId: "10001",
					label: "折线图",
					name: "折线图",
					icon: "line-md:hash-small",
					type: PermissionType.MENU,
					route: "linecharts",
					component: "/Display/Echarts/line-charts.tsx",
					order: 1,
				}
			]
		},
		{
			id: "10002",
			parentId: "10000",
			label: "主题色",
			name: "主题色",
			icon: "line-md:mushroom-filled",
			type: PermissionType.MENU,
			component: "/Display/ThemeColors/index.tsx",
			route: "theme-color",
		},
	],
}


// 将PERMISSION_LIST的树结构展平，模拟在数据库中的情况
export const PERMISSION_LIST = [
	DATA_SCREEN_PERMISSION,
	SERVER_PERMISSION,
	USER_PERMISSION,
	PERMISSION_PERMISSION,
	COMPONENTS_PERMISSION,
	TOOLS_PERMISSION,
	CSSLAYOUT_PERMISSION,
	HERO_PERMISSION,
	MENU_PERMISSION,
	PLAY_PERMISSION,
	AI_PERMISSION
];

// 扁平化权限数据，模拟数据库存储
export const PERMISSION_LIST_FLATTENED = PermisionTree2List(PERMISSION_LIST);

// 权限数据管理类
class PermissionManager {
	private permissions: Omit<Permission, 'children'>[] = [...PERMISSION_LIST_FLATTENED];

	// 获取所有权限（扁平）
	getAllPermissions() {
		return [...this.permissions];
	}

	// 获取权限树
	getPermissionTree() {
		return PermissionListFattented2Tree(this.permissions);
	}

	// 根据ID获取权限
	getPermissionById(id: string) {
		return this.permissions.find(p => p.id === id);
	}

	// 根据ID数组获取权限数组
	getPermissionsByIds(ids: string[]) {
		// If no ids are provided, return an empty array
		if (!ids || ids.length === 0) {
			return [];
		}

		// Convert all ids to strings to ensure proper comparison
		const stringIds = ids.map(id => String(id));

		// Get all permissions from the flattened list
		const allPermissions = this.getAllPermissions();

		// Filter permissions by the provided ids
		return allPermissions.filter(permission =>
			stringIds.includes(String(permission.id))
		);
	}

	// 添加权限
	addPermission(permission: Omit<Permission, 'children'>) {
		// 检查ID是否已存在
		if (this.permissions.find(p => p.id === permission.id)) {
			throw new Error('权限ID已存在');
		}

		// 验证父节点是否存在（如果有父节点）
		if (permission.parentId && !this.permissions.find(p => p.id === permission.parentId)) {
			throw new Error('父节点不存在');
		}

		this.permissions.push(permission);
		return permission;
	}

	// 更新权限
	updatePermission(id: string, updates: Partial<Omit<Permission, 'children' | 'id'>>) {
		const index = this.permissions.findIndex(p => p.id === id);
		if (index === -1) {
			throw new Error('权限不存在');
		}

		// 如果更新父节点，验证父节点是否存在
		if (updates.parentId && !this.permissions.find(p => p.id === updates.parentId)) {
			throw new Error('父节点不存在');
		}

		// 检查是否会形成循环引用
		if (updates.parentId && this.wouldCreateCycle(id, updates.parentId)) {
			throw new Error('不能将节点设置为自己的子节点');
		}

		this.permissions[index] = { ...this.permissions[index], ...updates };
		return this.permissions[index];
	}

	// 删除权限
	deletePermission(id: string) {
		const index = this.permissions.findIndex(p => p.id === id);
		if (index === -1) {
			throw new Error('权限不存在');
		}

		// 检查是否有子节点
		const hasChildren = this.permissions.some(p => p.parentId === id);
		if (hasChildren) {
			throw new Error('存在子节点，无法删除');
		}

		const deleted = this.permissions[index];
		this.permissions.splice(index, 1);
		return deleted;
	}

	// 批量删除权限
	deletePermissions(ids: string[]) {
		const deleted: Omit<Permission, 'children'>[] = [];

		// 按层级排序，先删除子节点
		const sortedIds = this.sortByHierarchy(ids);

		for (const id of sortedIds) {
			try {
				const deletedItem = this.deletePermission(id);
				deleted.push(deletedItem);
			} catch (error) {
				// 如果某个删除失败，继续删除其他的
				console.warn(`删除权限 ${id} 失败:`, error);
			}
		}

		return deleted;
	}

	// 获取所有目录类型的权限
	getCataloguePermissions() {
		return this.permissions.filter(p => p.type === PermissionType.CATALOGUE);
	}

	// 获取下一个可用的根权限节点ID
	getNextRootPermissionId(): string {
		const rootPermissions = this.permissions.filter(p => !p.parentId || p.parentId === '');
		const rootIds = rootPermissions.map(p => parseInt(p.id)).filter(id => !isNaN(id));

		if (rootIds.length === 0) {
			return '1000';
		}

		// 找到最大的根ID，然后递增到下一个百位数
		const maxRootId = Math.max(...rootIds);
		let nextId = Math.ceil((maxRootId + 1) / 1000) * 1000;

		// 确保ID不存在
		while (this.permissions.find(p => p.id === nextId.toString())) {
			nextId += 1000;
		}

		return nextId.toString();
	}

	// 根据父节点ID获取下一个可用的子节点ID
	getNextChildPermissionId(parentId: string): string {
		if (!parentId) {
			throw new Error('父节点ID不能为空');
		}

		// 验证父节点是否存在
		const parentNode = this.permissions.find(p => p.id === parentId);
		if (!parentNode) {
			throw new Error('父节点不存在');
		}

		// 获取该父节点下的所有子节点
		const childPermissions = this.permissions.filter(p => p.parentId === parentId);
		const childIds = childPermissions.map(p => parseInt(p.id)).filter(id => !isNaN(id));

		const parentIdNum = parseInt(parentId);
		if (isNaN(parentIdNum)) {
			throw new Error('父节点ID格式不正确');
		}

		// 如果没有子节点，返回父节点ID+1
		if (childIds.length === 0) {
			return (parentIdNum + 1).toString();
		}

		// 找到最大的子节点ID，然后递增1
		const maxChildId = Math.max(...childIds);
		let nextId = maxChildId + 1;

		// 确保ID不存在
		while (this.permissions.find(p => p.id === nextId.toString())) {
			nextId++;
		}

		return nextId.toString();
	}

	// 检查是否会形成循环引用
	private wouldCreateCycle(nodeId: string, newParentId: string): boolean {
		let currentId = newParentId;
		while (currentId) {
			if (currentId === nodeId) {
				return true;
			}
			const parent = this.permissions.find(p => p.id === currentId);
			currentId = parent?.parentId || '';
		}
		return false;
	}

	// 按层级排序（子节点在前）
	private sortByHierarchy(ids: string[]): string[] {
		const getDepth = (id: string): number => {
			let depth = 0;
			let currentId = id;
			while (currentId) {
				const item = this.permissions.find(p => p.id === currentId);
				if (!item?.parentId) break;
				currentId = item.parentId;
				depth++;
			}
			return depth;
		};

		return ids.sort((a, b) => getDepth(b) - getDepth(a));
	}
}

// 创建权限管理器实例
export const permissionManager = new PermissionManager();

function PermissionListFattented2Tree(list: Omit<Permission, 'children'>[]) {
	const copyList = list.map((item) => ({ ...item, children: [] }))
	const mapNode = new Map<string, Permission>()
	copyList.forEach(node => mapNode.set(node.id, node))

	const roots: Permission[] = []
	copyList.forEach(item => {
		const parentId = item.parentId
		if (!parentId || !mapNode.has(parentId)) {
			roots.push(item)
		} else {
			const parentNode = mapNode.get(parentId)!
			parentNode.children = parentNode.children ?? [];
			parentNode.children.push(item);
		}
	})

	return roots
}
export const PERMISSION_LIST_FATTENDTED = PermisionTree2List(PERMISSION_LIST)
export const PERMISSION_TREE = PermissionListFattented2Tree(PERMISSION_LIST_FATTENDTED)

const ADMIN_ROLE = {
	id: "1",
	name: "Admin",
	label: "admin",
	status: PermissionBasicStatus.ENABLE,
	order: 1,
	desc: "Super Admin",
	permission: permissionManager.getPermissionTree(),
};
const TEST_ROLE = {
	id: "2",
	name: "Test",
	label: "test",
	status: PermissionBasicStatus.ENABLE,
	order: 2,
	desc: "test",
	permission: [
		{ ...USER_PERMISSION, children: [...(USER_PERMISSION.children || [])] },
		{ ...COMPONENTS_PERMISSION, children: [...(COMPONENTS_PERMISSION.children || [])] },
		{ ...TOOLS_PERMISSION, children: [...(TOOLS_PERMISSION.children || [])] }
	],
};
export const ROLE_LIST = [ADMIN_ROLE, TEST_ROLE];

// 角色数据管理类
class RoleManager {
	private roles: typeof ADMIN_ROLE[] = [...ROLE_LIST];

	// 获取所有角色
	getAllRoles() {
		return [...this.roles];
	}

	// 根据ID获取角色
	getRoleById(id: string) {
		return this.roles.find(r => r.id === id);
	}

	// 添加角色
	addRole(role: Omit<typeof ADMIN_ROLE, 'id'>) {
		// 生成新ID
		const maxId = Math.max(...this.roles.map(r => parseInt(r.id)), 0);
		const newId = (maxId + 1).toString();

		const newRole = { ...role, id: newId };
		this.roles.push(newRole);
		return newRole;
	}

	// 更新角色
	updateRole(id: string, updates: Partial<Omit<typeof ADMIN_ROLE, 'id'>>) {
		const index = this.roles.findIndex(r => r.id === id);
		if (index === -1) {
			throw new Error('角色不存在');
		}

		// 过滤掉空值
		const filteredUpdates = Object.fromEntries(
			Object.entries(updates).filter(([_, value]) =>
				value !== undefined && value !== '' && value !== null
			)
		);

		this.roles[index] = { ...this.roles[index], ...filteredUpdates };
		return this.roles[index];
	}

	// 删除角色
	deleteRole(id: string) {
		const index = this.roles.findIndex(r => r.id === id);
		if (index === -1) {
			throw new Error('角色不存在');
		}

		// 检查是否为系统默认角色
		if (id === "1") {
			throw new Error('不能删除管理员角色');
		}

		const deleted = this.roles[index];
		this.roles.splice(index, 1);
		return deleted;
	}

	// 批量删除角色
	deleteRoles(ids: string[]) {
		const deleted: typeof ADMIN_ROLE[] = [];

		for (const id of ids) {
			try {
				const deletedRole = this.deleteRole(id);
				deleted.push(deletedRole);
			} catch (error) {
				console.warn(`删除角色 ${id} 失败:`, error);
			}
		}

		return deleted;
	}

	// 获取下一个可用的角色ID
	getNextRoleId(): string {
		const maxId = Math.max(...this.roles.map(r => parseInt(r.id)), 0);
		return (maxId + 1).toString();
	}
}

// 创建角色管理器实例
export const roleManager = new RoleManager();

