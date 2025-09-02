import {
    createPermissionNode,
    deletePermissionNode,
    getPermissionList,
    updatePermissionNode,
    getRootPermissionList,
    getNextRootId,
    getNextChildId
} from "@/apis/service/permission-service";
import { Permission } from "@/types/roleType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const usePermissionList = () => {
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['permissionList'],
        queryFn: async () => {
            try {
                const result = await getPermissionList();

                if (result && result.code === 200 && result.data) {
                    return result.data;
                }
                return result.data
            }
            catch (e) {
                console.error('API Error:', e);
            }
        },
        retry: 3,
        staleTime: 10 * 1000,
        placeholderData: (previousData) => previousData,
    })

    const createPermission = useMutation({
        mutationFn: createPermissionNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionList'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast("创建权限节点成功", {
                description: `您在 ${(new Date()).toUTCString()} 创建了一个新权限节点`,
                action: {
                    label: "确认",
                    onClick: () => console.log("新权限节点已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`创建权限节点失败 ${error.message}`)
        },
    })

    const updatePermission = useMutation({
        mutationFn: updatePermissionNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionList'] });

            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast("更新权限节点成功", {
                description: `您在 ${(new Date()).toUTCString()} 更新了一个权限节点`,
                action: {
                    label: "确认",
                    onClick: () => console.log("更新权限节点已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`更新权限节点失败 ${error.message}`)
        },
    })

    const deletePermission = useMutation({
        mutationFn: deletePermissionNode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissionList'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast("删除权限节点成功", {
                description: `您在 ${(new Date()).toUTCString()} 删除了一个权限节点`,
                action: {
                    label: "确认",
                    onClick: () => console.log("删除权限节点已经确认"),
                },
            })
        },
        onError: (error: Error) => {
            toast(`删除权限节点失败 ${error.message}`)
        },
    })

    return {
        data: query.data,
        isLoading: query.isLoading,
        createPermission,
        updatePermission,
        deletePermission
    }
}

const useRootPermissionList = () => {
    return useQuery({
        queryKey: ['rootPermissionList'],
        queryFn: getRootPermissionList,
        staleTime: 10 * 1000,
        retry: 2,
        meta: { silent: true },
    });
};

const useNextRootId = () => {
    const query = useQuery({
        queryKey: ['nextRootId'],
        queryFn: getNextRootId,
        staleTime: 10 * 1000,
        retry: 2,
        meta: { silent: true },
    });
    return {
        data: query.data,
        isLoading: query.isLoading
    }
}

const useNextChildId = () => {
    const [parentId, setParentId] = useState<string>("")
    const query = useQuery({
        queryKey: ['nextChildId', parentId],
        queryFn: () => getNextChildId(parentId),
        staleTime: 10 * 1000,
        enabled: !!parentId,
        retry: 2,
        meta: { silent: true },
    });
    return {
        setParentId,
        data: query.data,
        isLoading: query.isLoading
    }
}



const usePermissionTable = () => {
    const { updatePermission, deletePermission, createPermission } = usePermissionList()
    const { setParentId, data: nextChildId, isLoading: nextChildLoading } = useNextChildId()
    // create模式状态
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    // 编辑模式状态
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // 编辑的TData
    const [editingItem, setEditingItem] = useState<Omit<Permission, 'children'> | undefined>(undefined)

    // 当前dialog 类型
    const [dialogType, setDialogType] = useState<"create" | "push" | "update">()

    // 添加状态来跟踪是否正在等待子节点ID
    const [waitingForChildId, setWaitingForChildId] = useState<string | null>(null)

    // 监听nextChildLoading的变化
    useEffect(() => {
        if (!nextChildLoading && nextChildId && waitingForChildId) {
            const newNode: Permission = {
                id: nextChildId.data.id,
                type: 1,
                parentId: waitingForChildId,
                status: 0,
                label: "",
                name: "",
                route: "",
                icon: "",
                order: 0,
            };
            setEditingItem(newNode)
            setDialogType("push")
            setIsEditDialogOpen(true)
            setWaitingForChildId(null) // 清除等待状态
        }
    }, [nextChildLoading, nextChildId, waitingForChildId])

    // 用户点击编辑内容
    const handleOpenEditDialog = (item: Omit<Permission, 'children'>) => {
        setEditingItem(item)
        setDialogType("update")
        setIsEditDialogOpen(true)
    }

    const handleOpenCreateDialog = () => {
        setEditingItem(null)
        setIsCreateDialogOpen(true)
        setDialogType("create")
        return;
    }
    // 在父目录下追加一个子权限
    const handleOpenPushDialog = (parentId: string) => {
        console.log(parentId)
        if (!parentId) {
            // 根节点新增
            setDialogType("create")
            setIsEditDialogOpen(true)
            return;
        }

        setParentId(parentId);
        setWaitingForChildId(parentId); // 设置等待状态
    }

    const handleCloseDialog = () => {
        setIsCreateDialogOpen(false)
        setIsEditDialogOpen(false)
        setEditingItem(undefined)
        setWaitingForChildId(null) // 清除等待状态
    }

    const handleEditPermission = (node: Omit<Permission, 'children'>) => {
        updatePermission.mutate(node)
    }
    const handleDeletePermission = (id: string) => {
        deletePermission.mutate(id)
    }

    const handleCreatePermission = (node: Omit<Permission, 'children'>) => {
        createPermission.mutate(node)
    }

    return {
        handleCreatePermission,
        handleDeletePermission,
        handleEditPermission,
        handleOpenEditDialog,
        handleCloseDialog,
        handleOpenCreateDialog,
        handleOpenPushDialog,
        isCreateDialogOpen,
        isEditDialogOpen,
        editingItem,
        dialogType,
        nextChildLoading // 可选：暴露loading状态供UI使用
    }
}

export {
    usePermissionList,
    usePermissionTable,
    useRootPermissionList,
    useNextRootId,
    useNextChildId
}


