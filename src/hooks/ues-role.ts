import { useState } from "react";
import {
    getRoleList,
    createRole as createRoleApi,
    deleteRole as deleteRoleApi,
    updateRole as updateRoleApi
} from "@/apis/role-service";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner"
import { Role } from "@/types/roleType";
const useRoleList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState<string>("")
    const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ['role-list', currentPage, filterName],
        queryFn: async () => {
            try {
                const result = await getRoleList(currentPage, filterName);

                if (result && result.code === 200 && result.data) {
                    return result.data;
                }
                return {
                    roles: [],
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



    const deleteRole = useMutation({
        mutationFn: deleteRoleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['role-list'] });
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

    const createRole = useMutation({
        mutationFn: createRoleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['role-list'] });
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

    const updateRole = useMutation({
        mutationFn: updateRoleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['role-list'] });
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
        roles: [],
        currentPage: 1,
        size: 10,
        totalCount: 0,
        totalPages: 1
    };
    // 需要这样做，因为 返回的pagination会直接从query中读取，
    // 此时query可能处于isfetching状态，值为undefined
    const data = query.data || defaultData;

    return {
        roleListData: data,
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
        createRole,
        updateRole,
        deleteRole

    }
}


const useRoleTable = () => {
    const { updateRole, deleteRole, createRole } = useRoleList()
    // create模式状态
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    // 编辑模式状态
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // 编辑的TData
    const [editingItem, setEditingItem] = useState<Role | undefined>(undefined)

    // 管理选中状态
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // 删除选中项的逻辑
    const handleDeleteSelected = () => {
        const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
        deleteRole.mutate(selectedIds);
        setRowSelection({});
    };
    // 计算选中数量
    const selectedCount = Object.keys(rowSelection).filter(id => rowSelection[id]).length;

    // 用户点击编辑内容
    const handleOpenEditDialog = (item: Role) => {
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

    const handleEdit = (role: Omit<Role,'permission'> & { permissionIds: string[] }) => {
        updateRole.mutate({ id: role.id, role: role })
    }
    const handleDelete = (id: string) => {
        deleteRole.mutate([id])
    }

    const handleCreate = (role:  Omit<Role,'permission'> & { permissionIds: string[] }) => {
        createRole.mutate(role)
    }

    return {
        handleCreate,
        handleDelete,
        handleEdit,
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
    useRoleList,
    useRoleTable
}