import { createColumnHelper } from "@tanstack/react-table"
import type { UserItem } from "@/types/userType"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UseMutationResult } from "@tanstack/react-query"
const columnHelper = createColumnHelper<UserItem>()

// 将 columns 定义为一个函数，接受 deleteUser 作为参数
const createAdminUserColumns = (deleteUser: UseMutationResult) => {
    const handleDeleteUser = (id: string) => {
        deleteUser.mutate([id])
    }

    return [

    columnHelper.accessor('id',{
        header: 'ID',
    }),

    columnHelper.accessor('name', {
        header: '姓名',
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('email', {
        header: '邮箱',
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('avatar', {
        header: '头像',
        cell: (info) => (
            <img
                src={info.getValue()}
                alt="avatar"
                className="w-8 h-8 rounded-full"
            />
        ),
    }),

    columnHelper.display({
        id: "actions",
        header: "操作",
        cell: ({ row }) => {
            return (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>编辑</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(row.original.id)}>
                                删除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },),
    ]
}

export default createAdminUserColumns