import { requestClient } from "@/utils";
import { Role } from "@/types/roleType";
import { apiList } from "./api-list";
type RoleListResponse = {
    data: {
        currentPage: number,
        size: number,
        totalCount: number,
        totalPages: number,
        roles: Role[]
    }
    code: number
}


const getRoleList = async (page = 1, name?: string) => {
    try {
        const params = { page, name };

        const response = await requestClient.get<RoleListResponse>({
            url: `${apiList.role.getRoleList}`,
            params,
        });
        return response;
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
};

const deleteRole = async (ids: string[]) => {
    try {
        const response = await requestClient.delete({
            url: `${apiList.role.deleteRole}/${ids}`,
        })

        return response
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}

const updateRole = async ({ id, role }: { id: string, role: Role }) => {
    try {
        const res = await requestClient.put({
            url: `${apiList.role.updateRole}/${id}`,
            data: role
        })
        return res
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}

const createRole = async (role:Role) => {
    try {
        const res = await requestClient.post({
            url: `${apiList.user.createUser}`,
            data: role
        })
        return res
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}
export {
    getRoleList,
    deleteRole,
    createRole,
    updateRole,
}