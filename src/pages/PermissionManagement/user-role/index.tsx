import { SakuraTable } from '@/components/table';
import CreateAdminUserColumns from './colums';
import {
    useRoleList,
    useRoleTable
} from '@/hooks/ues-role';
import SakuraTableBar from '@/components/table/sakura-table-bar';
import RoleDialog from './dialog';
export default function AdminUserManagement() {
    const {
        roleListData,
        pagination,
        filterName,
        setFilterName,
    } = useRoleList()

    const {
        handleCreate,
        handleEdit,
        handleDelete,
        handleOpenCreateDialog,
        handleOpenEditDialog,
        handleCloseDialog,
        handleDeleteSelected,
        rowSelection,
        selectedCount,
        setRowSelection,
        isCreateDialogOpen,
        isEditDialogOpen,
        editingItem,
    } = useRoleTable()



    const columns = CreateAdminUserColumns({ handleOpenEditDialog, handleDelete })


    return (
        <div className="container mx-auto">
            <SakuraTableBar
                enableSearch={true}
                enableCreate={true}
                enableSelected={true}
                searchValue={filterName}
                selectCount={selectedCount}
                onSearchChange={setFilterName}
                onOpenCreateDialog={handleOpenCreateDialog}
                onDeleteItems={handleDeleteSelected}
                searchPlaceholder='搜索名称'
                createButtonText='创建用户'
            />
            <SakuraTable
                columns={columns}
                data={roleListData?.roles.sort((a,b) => a.order-b.order) || []}
                serverPagination={pagination}
                rowSelection={rowSelection}
                enablePagination={true}
                onRowSelectionChange={setRowSelection}
            />


            <RoleDialog
                open={isCreateDialogOpen || isEditDialogOpen}
                enableSelected={true}
                updateItem={editingItem}
                handleCreate={handleCreate}
                handleEdit={handleEdit}
                onClose={handleCloseDialog}
            />




        </div>
    )
}