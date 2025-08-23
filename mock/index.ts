import type { MockMethod } from 'vite-plugin-mock'
import { faker } from "@faker-js/faker";
import { mockUsers } from './mockUser';
import type { Recordable } from 'vite-plugin-mock';
import { permissionManager, roleManager } from './mockRole';
interface Option {
    url: Recordable;
    body: Recordable;
    query: Recordable;
    headers: Recordable;
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


export default [
    {
        url: '/api/authorizations',
        method: 'post',
        response: () => {
            return {
                code: 200,
                data: {
                    token: "fenva",
                    refresh_token: "fjeaf"
                },
            }
        },
    },
    {
        url: '/api/user/profile',
        method: 'get',
        response: () => {
            // 动态获取最新的权限数据
            const adminRoleWithLatestPermissions = {
                id: "1",
                name: "Admin",
                label: "admin",
                status: PermissionBasicStatus.ENABLE,
                order: 1,
                desc: "Super Admin",
                permission: permissionManager.getPermissionTree(), // 动态获取最新权限
            };

            return {
                code: 200,
                data: {
                    id: faker.string.uuid(),
                    userRole: adminRoleWithLatestPermissions,
                    name: "lingwcy",
                    email: "lingwcy@126.com",
                    avatar: "https://avatars.githubusercontent.com/u/74972266?v=4&size=64",
                },
            }
        },
    },
    {
        url: '/api/users',
        method: 'get',
        response: function (opt: Option) {
            try {
                const currentPage = Number(opt?.query?.page) || 1
                const name = opt?.query?.name || ''
                const size = 10

                // 筛选器
                let filteredUsers = mockUsers.users
                if (name) {
                    filteredUsers = mockUsers.users.filter(user =>
                        user.name.toLowerCase().includes(name.toLowerCase())
                    )
                }

                const totalCount = filteredUsers.length
                const startIndex = (currentPage - 1) * size
                const endIndex = startIndex + size
                const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

                return {
                    code: 200,
                    data: {
                        currentPage,
                        size,
                        totalCount,
                        totalPages: Math.ceil(totalCount / size),
                        users: paginatedUsers
                    }
                }
            } catch (error) {
                console.error('Mock /api/users error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/user',
        method: 'post',
        response: function (opt: Option) {
            try {
                const { name, email, avatar } = opt.body || {};

                if (!name || !email) {
                    return {
                        code: 400,
                        message: '姓名和邮箱不能为空'
                    }
                }

                const newUser = mockUsers.addUser({ name, email, avatar, id: '' });

                return {
                    code: 200,
                    data: newUser,
                    message: '用户创建成功'
                }
            } catch (error) {
                console.error('Mock POST /api/users error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/user/:id',
        method: 'put',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                const userData = opt.body || {};

                if (!id) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const updatedUser = mockUsers.updateUser(id, userData);

                if (!updatedUser) {
                    return {
                        code: 404,
                        message: '用户不存在'
                    }
                }

                return {
                    code: 200,
                    data: updatedUser,
                    message: '用户更新成功'
                }
            } catch (error) {
                console.error('Mock PUT /api/users/:id error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/users/:ids',
        method: 'delete',
        response: function (opt: Option) {
            try {
                // Extract IDs from URL path instead of query
                const urlParts = opt.url.split('/');
                const idsParam = urlParts[urlParts.length - 1];

                if (!idsParam) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                // Split comma-separated IDs
                const idsArray = idsParam.split(',').filter(id => id.trim());

                if (idsArray.length === 0) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const deletedUsers = mockUsers.deleteUser(idsArray);

                return {
                    code: 200,
                    data: deletedUsers,
                    message: '用户删除成功'
                }
            } catch (error) {
                console.error('Mock DELETE /api/users/:ids error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/users/:id',
        method: 'get',
        response: function (opt: Option) {
            try {
                // Extract ID from URL path
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '用户ID不能为空'
                    }
                }

                const user = mockUsers.getUserById(id);

                if (!user) {
                    return {
                        code: 404,
                        message: '用户不存在'
                    }
                }

                return {
                    code: 200,
                    data: user
                }
            } catch (error) {
                console.error('Mock GET /api/users/:id error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permission',
        method: 'get',
        response: () => {
            return {
                code: 200,
                data: permissionManager.getPermissionTree()
            }
        },
    },
    {
        url: '/api/permission/next-root-id',
        method: 'get',
        response: () => {
            try {
                const nextId = permissionManager.getNextRootPermissionId();
                return {
                    code: 200,
                    data: { id: nextId },
                    message: '获取下一个根权限ID成功'
                }
            } catch (error) {
                console.error('Mock GET /api/permission/next-root-id error:', error);
                return {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Internal server error'
                }
            }
        },
    },
    {
        url: '/api/permission/next-child-id/:parentId',
        method: 'get',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const parentId = urlParts[urlParts.length - 1];

                if (!parentId) {
                    return {
                        code: 400,
                        message: '父节点ID不能为空'
                    }
                }

                const nextId = permissionManager.getNextChildPermissionId(parentId);

                return {
                    code: 200,
                    data: { id: nextId },
                    message: '获取下一个子权限ID成功'
                }
            } catch (error) {
                console.error('Mock GET /api/permission/next-child-id/:parentId error:', error);
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permission/:id',
        method: 'get',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '权限ID不能为空'
                    }
                }

                const permission = permissionManager.getPermissionById(id);

                if (!permission) {
                    return {
                        code: 404,
                        message: '权限不存在'
                    }
                }

                return {
                    code: 200,
                    data: permission
                }
            } catch (error) {
                console.error('Mock GET /api/permission/:id error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permission',
        method: 'post',
        response: function (opt: Option) {
            try {
                const permissionData = opt.body || {};

                if (!permissionData.id || !permissionData.name || !permissionData.label) {
                    return {
                        code: 400,
                        message: 'ID、名称和标签不能为空'
                    }
                }

                const newPermission = permissionManager.addPermission(permissionData as Omit<Permission, "children">);

                return {
                    code: 200,
                    data: newPermission,
                    message: '权限创建成功'
                }
            } catch (error) {
                console.error('Mock POST /api/permission error:', error)
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permission/:id',
        method: 'put',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];
                const updates = opt.body || {};

                if (!id) {
                    return {
                        code: 400,
                        message: '权限ID不能为空'
                    }
                }

                const updatedPermission = permissionManager.updatePermission(id, updates);

                return {
                    code: 200,
                    data: updatedPermission,
                    message: '权限更新成功'
                }
            } catch (error) {
                console.error('Mock PUT /api/permission/:id error:', error)
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permission/:id',
        method: 'delete',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '权限ID不能为空'
                    }
                }

                const deletedPermission = permissionManager.deletePermission(id);

                return {
                    code: 200,
                    data: deletedPermission,
                    message: '权限删除成功'
                }
            } catch (error) {
                console.error('Mock DELETE /api/permission/:id error:', error)
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permissions/:ids',
        method: 'delete',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const idsParam = urlParts[urlParts.length - 1];

                if (!idsParam) {
                    return {
                        code: 400,
                        message: '权限ID不能为空'
                    }
                }

                const idsArray = idsParam.split(',').filter(id => id.trim());

                if (idsArray.length === 0) {
                    return {
                        code: 400,
                        message: '权限ID不能为空'
                    }
                }

                const deletedPermissions = permissionManager.deletePermissions(idsArray);

                return {
                    code: 200,
                    data: deletedPermissions,
                    message: '权限批量删除成功'
                }
            } catch (error) {
                console.error('Mock DELETE /api/permissions/:ids error:', error)
                return {
                    code: 500,
                    message: 'Internal server error'
                }
            }
        }
    },
    {
        url: '/api/permissions/catalogue',
        method: 'get',
        response: () => {
            return {
                code: 200,
                data: permissionManager.getCataloguePermissions(),
                message: '获取目录权限成功'
            }
        },
    },
    // 角色相关接口
    {
        url: '/api/roles',
        method: 'get',
        response: function (opt: Option) {
            try {
                const currentPage = Number(opt?.query?.page) || 1;
                const name = opt?.query?.name || '';
                const size = 10;

                let filteredRoles = roleManager.getAllRoles();
                
                // 按名称筛选
                if (name) {
                    filteredRoles = filteredRoles.filter(role =>
                        role.name.toLowerCase().includes(name.toLowerCase()) ||
                        role.label.toLowerCase().includes(name.toLowerCase())
                    );
                }

                const totalCount = filteredRoles.length;
                const startIndex = (currentPage - 1) * size;
                const endIndex = startIndex + size;
                const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

                return {
                    code: 200,
                    data: {
                        currentPage,
                        size,
                        totalCount,
                        totalPages: Math.ceil(totalCount / size),
                        roles: paginatedRoles
                    }
                };
            } catch (error) {
                console.error('Mock /api/roles error:', error);
                return {
                    code: 500,
                    message: 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/role',
        method: 'post',
        response: function (opt: Option) {
            try {
                const { name, label, desc, status, order, permissionIds } = opt.body || {};

                if (!name || !label) {
                    return {
                        code: 400,
                        message: '角色名称和标签不能为空'
                    };
                }

                // Handle permissionIds if provided
                let permission = [];
                if (permissionIds) {
                    // Convert permissionIds to permission objects
                    permission = permissionManager.getPermissionsByIds(permissionIds);
                }

                const newRole = roleManager.addRole({
                    name,
                    label,
                    desc: desc || '',
                    status: status ?? PermissionBasicStatus.ENABLE,
                    order: order || 1,
                    permission: permission
                });

                return {
                    code: 200,
                    data: newRole,
                    message: '角色创建成功'
                };
            } catch (error) {
                console.error('Mock POST /api/role error:', error);
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/role/:id',
        method: 'get',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '角色ID不能为空'
                    };
                }

                const role = roleManager.getRoleById(id);

                if (!role) {
                    return {
                        code: 404,
                        message: '角色不存在'
                    };
                }

                return {
                    code: 200,
                    data: role
                };
            } catch (error) {
                console.error('Mock GET /api/role/:id error:', error);
                return {
                    code: 500,
                    message: 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/role/:id',
        method: 'put',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];
                const updates = opt.body || {};

                if (!id) {
                    return {
                        code: 400,
                        message: '角色ID不能为空'
                    };
                }

                // Handle permissionIds if provided
                if (updates.permissionIds) {
                    // Convert permissionIds to permission objects
                    const permissionIds = updates.permissionIds;
                    
                    // Create a permissions array by getting permission objects based on IDs
                    const permissions = permissionManager.getPermissionsByIds(permissionIds);
                    
                    // Replace permissionIds with the actual permission objects
                    updates.permission = permissions;
                    
                    // Remove permissionIds from updates as it's not needed anymore
                    delete updates.permissionIds;
                }

                const updatedRole = roleManager.updateRole(id, updates);

                return {
                    code: 200,
                    data: updatedRole,
                    message: '角色更新成功'
                };
            } catch (error) {
                console.error('Mock PUT /api/role/:id error:', error);
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/role/:id',
        method: 'delete',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const id = urlParts[urlParts.length - 1];

                if (!id) {
                    return {
                        code: 400,
                        message: '角色ID不能为空'
                    };
                }

                const deletedRole = roleManager.deleteRole(id);

                return {
                    code: 200,
                    data: deletedRole,
                    message: '角色删除成功'
                };
            } catch (error) {
                console.error('Mock DELETE /api/role/:id error:', error);
                return {
                    code: 400,
                    message: error instanceof Error ? error.message : 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/roles/:ids',
        method: 'delete',
        response: function (opt: Option) {
            try {
                const urlParts = opt.url.split('/');
                const idsParam = urlParts[urlParts.length - 1];

                if (!idsParam) {
                    return {
                        code: 400,
                        message: '角色ID不能为空'
                    };
                }

                const idsArray = idsParam.split(',').filter(id => id.trim());

                if (idsArray.length === 0) {
                    return {
                        code: 400,
                        message: '角色ID不能为空'
                    };
                }

                const deletedRoles = roleManager.deleteRoles(idsArray);

                return {
                    code: 200,
                    data: deletedRoles,
                    message: '角色批量删除成功'
                };
            } catch (error) {
                console.error('Mock DELETE /api/roles/:ids error:', error);
                return {
                    code: 500,
                    message: 'Internal server error'
                };
            }
        }
    },
    {
        url: '/api/role/next-id',
        method: 'get',
        response: () => {
            try {
                const nextId = roleManager.getNextRoleId();
                return {
                    code: 200,
                    data: { id: nextId },
                    message: '获取下一个角色ID成功'
                };
            } catch (error) {
                console.error('Mock GET /api/role/next-id error:', error);
                return {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Internal server error'
                };
            }
        },
    },
] as MockMethod[]