import { requestClient } from "@/utils";
import type { UserItem, UserProfile, UserSignIn, UserToken } from "@/types/userType";
import { apiList } from "./api-list";

type SigInResponse = {
    data: UserToken,
    message: string,
}

type UserProfileResponse = {
    data: UserProfile,
    message: string,
}

type UserListResponse = {
    data: {
        currentPage: number,
        size: number,
        totalCount: number,
        totalPages: number,
        users: UserItem[]
    }
    code: number
}
const signIn = (formData: UserSignIn) => requestClient.post<SigInResponse>({ url: apiList.user.signIn, data: formData })
const getUserProfile = () => requestClient.get<UserProfileResponse>({ url: apiList.user.userProfile })

const getUserList = async (page = 1, name?: string) => {
    try {
        const params = { page, name };

        const response = await requestClient.get<UserListResponse>({
            url: `${apiList.user.userList}`,
            params,
        });
        return response;
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
};

const deleteUsers = async (ids: string[]) => {
    try {
        const response = await requestClient.delete({
            url: `${apiList.user.deleteUsers}/${ids}`,
        })

        return response
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}

const updateUser = async ({ id, user }: { id: string, user: UserItem & { password: string } }) => {
    try {
        const res = await requestClient.put({
            url: `${apiList.user.updateUsers}/${id}`,
            data: user
        })
        return res
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}

const createUser = async (user: Omit<UserItem, 'id'> & { password: string }) => {
    try {
        const res = await requestClient.post({
            url: `${apiList.user.createUser}`,
            data: user
        })
        return res
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}
export {
    signIn,
    getUserProfile,
    getUserList,
    deleteUsers,
    updateUser,
    createUser
}