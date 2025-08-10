import { SakuraTable } from '@/components/table';
import CreateAdminUserColumns from './colums';
import { useUserList, useUserTable } from '@/hooks/use-user';
import UserDialog from './dialog';
import SakuraTableBar from '@/components/table/sakura-table-bar';
export default function AdminUserManagement() {
    const {
        userListData,
        pagination,
        filterName,
        setFilterName,
    } = useUserList()

    const {
        handleCreateUser,
        handleEditUser,
        handleDeleteUser,
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
    } = useUserTable()


    const columns = CreateAdminUserColumns({ handleOpenEditDialog, handleDeleteUser })


    return (
        <div className="container mx-auto py-10 h-[calc(100vh-105px)]">
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
                data={userListData?.users || []}
                serverPagination={pagination}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />


            <UserDialog
                open={isCreateDialogOpen || isEditDialogOpen}
                enableSelected={true}
                updateUserItem={editingItem}
                handleCreate={handleCreateUser}
                handleEdit={handleEditUser}
                onClose={handleCloseDialog}
            />


        </div>
    )
}