
import { SakuraTable } from '@/components/table';
import UserPermissionColums from './column';
import { usePermissionList } from '@/hooks/use-permission';
import SakuraTableBar from '@/components/table/sakura-table-bar';

export default function UserPermissionManagementPage() {

    const {
        data,
    } = usePermissionList()

    const columns = UserPermissionColums()

    return (
        <div className="container mx-auto py-10 h-[calc(100vh-105px)]">
            <SakuraTableBar
                enableSearch={false}
                enableCreate={false}
                enableSelected={false}
                searchPlaceholder='搜索名称'
                createButtonText='创建用户'
            />
            <SakuraTable
                columns={columns}
                data={data}
            />
        </div>
    )

}
