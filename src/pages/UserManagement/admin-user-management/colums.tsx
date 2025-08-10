import { createColumnHelper } from "@tanstack/react-table"
import type { UserItem } from "@/types/userType"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { MoveDownIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"


const columnHelper = createColumnHelper<UserItem>()

interface CreateAdminUserColumnsProps {
    handleOpenEditDialog: (item: UserItem) => void,
    handleDeleteUser: (id: string) => void

}

export default function CreateAdminUserColumns({
    handleOpenEditDialog,
    handleDeleteUser
}: CreateAdminUserColumnsProps) {



    return [
        columnHelper.display({
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false
        }),
        columnHelper.accessor('id', {
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
            header: ({ table }) => {
                return (
                    <div className=" flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto">
                                    属性筛选
                                    <MoveDownIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) => column.getCanHide()
                                    )
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className=" flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenEditDialog(row.original)}>
                                    编辑
                                </DropdownMenuItem>
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