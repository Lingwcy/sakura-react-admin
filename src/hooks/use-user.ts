import { useUserStore } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, getUserProfile, getUserList, deleteUsers } from "@/apis/userService";
import type { UserProfile, UserSignIn } from "@/types/userType";
import { useState } from "react";
import { toast } from "sonner"

const useUserToken = () => {
    const userToken = useUserStore((state) => state.userToken)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const signInMutation = useMutation({
        mutationFn: signIn,
    });

    const sinIn = async (formData: UserSignIn) => {
        try {
            const result = await signInMutation.mutateAsync(formData)
            setUserToken(result.data)

        } catch (e: unknown) {
            console.log('登录错误:', e)
            throw e;
        }
    }

    const clearUserToken = () => setUserToken({
        token: '',
        refresh_token: userToken.refresh_token
    })

    return {
        sinIn,
        userToken,
        clearUserToken
    };

}

const useUserProfile = () => {
    const userProfile = useUserStore((state) => (state.userProfile))
    const setUserProfile = useUserStore((sate) => (sate.setUserProfile))

    const userProfileMutaition = useMutation({
        mutationFn: getUserProfile,
    })

    const getUserInfo = async () => {
        try {
            const result = await userProfileMutaition.mutateAsync();
            setUserProfile(result.data)
        } catch (e: unknown) {
            console.log('登录错误:', e)
            throw e;
        }
    }

    const clearUserInfo = () => setUserProfile({} as UserProfile)

    return {
        getUserInfo,
        userProfile,
        clearUserInfo
    }
}

const useUserList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['user-list', currentPage],
        queryFn: async () => {
            try {
                const result = await getUserList(currentPage);

                if (result && result.code === 200 && result.data) {
                    return result.data;
                }
                return {
                    users: [],
                    currentPage: 1,
                    size: 10,
                    totalCount: 0,
                    totalPages: 1
                };
            }
            catch (e) {
                console.error('API Error:', e);
            }
        },
        retry: 3,
        staleTime: 10 * 1000,
        placeholderData: (previousData) => previousData,
    })

    const deleteUser = useMutation({
        mutationFn: deleteUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-list', currentPage] });
            toast("删除用户成功", {
                description: `您在 ${(new Date()).toUTCString()} 删除了用户`,
                action: {
                    label: "确认",
                    onClick: () => console.log("用户已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`删除用户失败 ${error.message}`)
        },
    })

    const defaultData = {
        users: [],
        currentPage: 1,
        size: 10,
        totalCount: 0,
        totalPages: 1
    };
    // 需要这样做，因为 返回的pagination会直接从query中读取，
    // 此时query可能处于isfetching状态，值为undefined
    const data = query.data || defaultData;

    return {
        userListData: data,
        isLoading: query.isLoading,
        error: query.error,
        pagination: {
            totalCount: Number(data.totalCount) || 0,
            totalPages: Number(data.totalPages) || 1,
            currentPage: Number(data.currentPage) || 1,
            setPage: setCurrentPage,
            getPage: currentPage,
        },
        isFeching: query.isFetching,
        deleteUser
    }
}

export {
    useUserToken,
    useUserProfile,
    useUserList,

}