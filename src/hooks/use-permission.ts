import {
    createPermissionNode,
    deletePermissionNode,
    getPermissionList,
    updatePermissionNode,
    getRootPermissionList,
    getNextRootId,
    getNextChildId
} from "@/apis/permission-service";
import { Permission } from "@/types/roleType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
    // create模式状态
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    // 编辑模式状态
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // 编辑的TData
    const [editingItem, setEditingItem] = useState<Omit<Permission, 'children'> | undefined>(undefined)

    // 用户点击编辑内容
    const handleOpenEditDialog = (item: Omit<Permission, 'children'>) => {
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
        isCreateDialogOpen,
        isEditDialogOpen,
        editingItem
    }
}

export {
    usePermissionList,
    usePermissionTable,
    useRootPermissionList,
    useNextRootId,
    useNextChildId
}


