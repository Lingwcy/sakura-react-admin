import { useUserStore } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, getUserProfile, getUserList, deleteUsers, updateUser as updateUserApi, createUser as createUserApi } from "@/apis/userService";
import type { UserProfile, UserSignIn } from "@/types/userType";
import { useState } from "react";
import { toast } from "sonner"
import { UserItem } from "@/types/userType";
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
    const [filterName, setFilterName] = useState<string>("")
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['user-list', currentPage, filterName],
        queryFn: async () => {
            try {
                const result = await getUserList(currentPage, filterName);

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
            queryClient.invalidateQueries({ queryKey: ['user-list' ]});
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

    const createUser = useMutation({
        mutationFn: createUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-list'] });
            toast("创建用户成功", {
                description: `您在 ${(new Date()).toUTCString()} 创建了用户`,
                action: {
                    label: "确认",
                    onClick: () => console.log("用户已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`创建用户失败 ${error.message}`)
        },
    })

    const updateUser = useMutation({
        mutationFn: updateUserApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-list'] });
            toast("更新用户成功", {
                description: `您在 ${(new Date()).toUTCString()} 更新了用户`,
                action: {
                    label: "确认",
                    onClick: () => console.log("用户已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`更新用户失败 ${error.message}`)
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
        setFilterName,
        filterName,
        error: query.error,
        pagination: {
            totalCount: Number(data.totalCount) || 0,
            totalPages: Number(data.totalPages) || 1,
            currentPage: Number(data.currentPage) || 1,
            setPage: setCurrentPage,
            getPage: currentPage,
        },
        isFeching: query.isFetching,
        deleteUser,
        updateUser,
        createUser
    }
}

const useUserTable = () => {
    const {updateUser, deleteUser, createUser} = useUserList()
    // create模式状态
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    // 编辑模式状态
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // 编辑的TData
    const [editingItem, setEditingItem] = useState<UserItem | undefined>(undefined)

        // 管理选中状态
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

        // 删除选中项的逻辑
    const handleDeleteSelected = () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
        deleteUser.mutate(selectedIds);
        setRowSelection({});
    };
    // 计算选中数量
    const selectedCount = Object.keys(rowSelection).filter(id => rowSelection[id]).length;

    // 用户点击编辑内容
    const handleOpenEditDialog = (item: UserItem) => {
        setEditingItem(item)
        setIsEditDialogOpen(true)
    }

    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        setEditingItem(undefined)
    }

    const handleEditUser = (user: UserItem & {password:string}) => {
        updateUser.mutate({ id: user.id, user: user })
    }
    const handleDeleteUser = (id: string) => {
        deleteUser.mutate([id])
    }

    const handleCreateUser = (user: Omit<UserItem, 'id'> & {password:string}) => {
        createUser.mutate(user)
    }

    return {
        handleCreateUser,
        handleDeleteUser,
        handleEditUser,
        handleOpenEditDialog,
        handleCloseDialog,
        handleOpenCreateDialog,
        handleDeleteSelected,
        setRowSelection,
        rowSelection,
        selectedCount,
        isCreateDialogOpen,
        isEditDialogOpen,
        editingItem
    }
}



export {
    useUserToken,
    useUserProfile,
    useUserList,
    useUserTable

}