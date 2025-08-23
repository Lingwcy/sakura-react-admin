import { createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { MoveDownIcon } from "lucide-react"
import { Role } from "@/types/roleType"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"


const columnHelper = createColumnHelper<Role>()

interface CreateAdminUserColumnsProps {
    handleOpenEditDialog: (item: Role) => void,
    handleDelete: (id: string) => void

}

export default function CreateAdminUserColumns({
    handleOpenEditDialog,
    handleDelete
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
            header: '名称',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('label', {
            header: '标签',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('status', {
            header: '状态',
            cell: (info) => (
                <Badge className={
                    clsx(info.getValue() === 0 ? 'bg-destructive' : 'bg-primary')
                }>
                    {info.getValue() === 1 ? '开启' : '关闭'}
                </Badge>
            ),
        }),

        columnHelper.accessor('order', {
            header: '排序',
            cell: (info) => {
               return <Badge>{info.getValue()}</Badge>
            },
        }),

        columnHelper.accessor('desc', {
            header: '描述',
            cell: (info) => {
               return <pre>{info.getValue()}</pre>
            },
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
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(row.original.id)}>
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