/**
 * 
GET /api/roles - Get all roles with pagination and search
POST /api/role - Create a new role
GET /api/role/:id - Get role by ID
PUT /api/role/:id - Update role by ID
DELETE /api/role/:id - Delete role by ID
DELETE /api/roles/:ids - Batch delete roles
GET /api/role/next-id - Get next available role ID
 */

export const apiList = {
    user: {
        signIn: "api/authorizations",
        userProfile: "api/user/profile",
        userList: "api/users",
        deleteUsers: "api/users",
        updateUsers: "api/user",
        createUser: "api/user"
    },
    permission: {
        getPermissionList: "api/permission",
        getPermissionById: "api/permission",
        createPermissionNode: "api/permission",
        deletePermissionNode: "api/permission",
        updatePermssionNode: "api/permsission",
        getRootPermissionList: "api/permissions/catalogue",
        getNextRootId: "api/permission/next-root-id",
        getNextChildId: "api/permission/next-child-id",
    },
    role: {
        getRoleList: "api/roles",
        createRole: "api/role",
        getRole: "api/role",
        updateRole: "api/role",
        deleteRole: "api/role",
        deleteRoles: "api/roles"
    },
    weather: {
        getTodayWeather: 'https://api.open-meteo.com/v1/forecast?latitude=30.67&longitude=104.07&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=Asia/Shanghai'
    },
    openRouter: {
        listAvailableModels: 'https://openrouter.ai/api/v1/models'
    },
    modelProvider: {
        getLocalModelProvider: 'api/model-providers',
        createLocalModelProvider: 'api/model-provider',
        updateLocalModelProvider: 'api/model-provider',
        deleteLocalModelProvider: 'api/model-provider',
        getNextProviderId: 'api/model-provider/next-id',
        // 模型相关接口
        getModels: 'api/model-provider',
        createModel: 'api/model-provider',
        getModel: 'api/model-provider',
        updateModel: 'api/model-provider',
        deleteModel: 'api/model-provider',
        deleteModels: 'api/model-provider',
        // 已添加本地模型聚合
        getAddedModels: 'api/model-providers/added-models',
    }

}