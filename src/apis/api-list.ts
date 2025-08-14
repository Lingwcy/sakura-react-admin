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
    }

}