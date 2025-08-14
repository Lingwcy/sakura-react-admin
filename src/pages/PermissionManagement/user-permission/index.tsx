import { SakuraTable } from '@/components/table';
import UserPermissionColums from './column';
import { usePermissionList, usePermissionTable } from '@/hooks/use-permission';
import SakuraTableBar from '@/components/table/sakura-table-bar';
import PermissionDialog from './dialog';
export default function UserPermissionManagementPage() {

    const {
        data,
    } = usePermissionList()

    const {
        handleCreatePermission,
        handleDeletePermission,
        handleEditPermission,
        handleOpenEditDialog,
        handleCloseDialog,
        handleOpenCreateDialog,
        isCreateDialogOpen,
        isEditDialogOpen,
        editingItem
    } = usePermissionTable()

    const columns = UserPermissionColums({ handleOpenEditDialog, handleDeletePermission })
    return (
        <div className="container mx-auto">
            <SakuraTableBar
                enableSearch={false}
                enableCreate={true}
                enableSelected={false}
                onOpenCreateDialog={handleOpenCreateDialog}
                searchPlaceholder='搜索名称'
                createButtonText='创建权限节点'

            />
            <SakuraTable
                columns={columns}
                data={data}
            />

            <PermissionDialog 
                open={isCreateDialogOpen || isEditDialogOpen}
                enableSelected={true}
                updateItem={editingItem}
                handleCreate={handleCreatePermission}
                handleEdit={handleEditPermission}
                onClose={handleCloseDialog}/>
        </div>
    )

}
