import { apiList } from "./api-list";
import { requestClient } from "@/utils";
import { Permission } from "@/types/roleType";
type PermissionListResponse = {
    code: number,
    data: Permission[]
}
type GetPermissionNodeResponse = {
    code: number,
    data: Omit<Permission,"children">
}

type CreatePermissionNodeResponse = {
    code: number,
    data: Omit<Permission,"children">
}
type UpdatePermissionNodeResponse = {
    code: number,
    data: Omit<Permission,"children">
}
type DeletePermissionNodeResponse = {
    code: number,
    data: Omit<Permission,"children">
}

type GetNextRootId = {
    code:number,
    data: {
        id:string
    }
    message:string
}
const getPermissionList = async () => {
    try {
        const response = await requestClient.get<PermissionListResponse>({
            url: `${apiList.permission.getPermissionList}`,
        });
        return response;
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
};


const getPermissionById = async (id:string) => {
    try{
        const response = await requestClient.get<GetPermissionNodeResponse>({
            url: `${apiList.permission.getPermissionById}/${id}`,
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const createPermissionNode = async (node:Omit<Permission,"children">) => {
        try{
        const response = await requestClient.post<CreatePermissionNodeResponse>({
            url: `${apiList.permission.getPermissionById}`,
            data: node
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const updatePermissionNode = async (node:Omit<Permission,"children">) => {
        try{
        const response = await requestClient.put<UpdatePermissionNodeResponse>({
            url: `${apiList.permission.getPermissionById}/${node.id}`,
            data: node
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const deletePermissionNode = async (id:string) => {
        try{
        const response = await requestClient.delete<DeletePermissionNodeResponse>({
            url: `${apiList.permission.getPermissionById}/${id}`,
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const getRootPermissionList = async () => {
        try{
        const response = await requestClient.get<PermissionListResponse>({
            url: `${apiList.permission.getRootPermissionList}`,
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const getNextRootId = async () => {
    try{
        const response = await requestClient.get<GetNextRootId>({
            url: `${apiList.permission.getNextRootId}`,
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}

const getNextChildId = async (parentId:string) => {
    try{
        const response = await requestClient.get<GetNextRootId>({
            url: `${apiList.permission.getNextChildId}/${parentId}`,
        });
        return response;
    } catch (error) {
        console.error("Permission API error:", error);
        throw error;
    }
}
export {
    getPermissionList,
    getPermissionById,
    createPermissionNode,
    updatePermissionNode,
    deletePermissionNode,
    getRootPermissionList,
    getNextRootId,
    getNextChildId
}