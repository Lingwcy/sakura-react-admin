import { SakuraTable } from '@/components/table';
import createAdminUserColumns from './colums';
import { useUserList } from '@/hooks/use-user';
import BorderLoading from '@/components/loading/border-loading';
import UserDialog from './dialog';

export default function AdminUserManagement() {
    const { userListData, pagination, isLoading, error, isFeching, deleteUser } = useUserList()

    const adminUserColumns = createAdminUserColumns(deleteUser)

    const handleDeleteSelectedUser = (ids: string[]) => {
        deleteUser.mutate(ids)
    }
    return (
        <div className="container mx-auto py-10 h-[calc(100vh-105px)]">
            {isLoading || isFeching ? (
                <div className="flex justify-center items-center h-64">
                    <BorderLoading />
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg text-red-500">加载失败: {error.message}</div>
                </div>
            ) : (
                <SakuraTable
                    columns={adminUserColumns}
                    data={userListData?.users || []}
                    createButtonText='新增用户'
                    searchPlaceholder='搜索名称'
                    searchKey='name'
                    serverPagination={pagination}
                    onDeleteItems = {handleDeleteSelectedUser}
                    itemDialog = {UserDialog}
                    enableCreateAndUpdate = {true}
                    enableSelected = {true}
                />
            )}
        </div>
    )
}