export enum PermissionBasicStatus {
	DISABLE = 0,
	ENABLE = 1,
}
export enum PermissionType {
	CATALOGUE = 0,
	MENU = 1,
	BUTTON = 2,
}

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

export interface Role {
	id: string;
	name: string;
	label: string;
	status: PermissionBasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission[];
}
