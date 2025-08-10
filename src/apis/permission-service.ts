import { apiList } from "./api-list";
import { requestClient } from "@/utils";
import { Permission } from "@/types/roleType";
type PermissionListResponse = {
    code: number,
    data: Permission[]
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


export {
    getPermissionList
}