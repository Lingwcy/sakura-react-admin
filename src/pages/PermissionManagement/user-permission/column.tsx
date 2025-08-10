import { createColumnHelper } from "@tanstack/react-table"
import { Permission, PermissionBasicStatus } from "@/types/roleType"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MoveDownIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import Icon from "@/components/ui/icon"
import { Plus, Minus } from "lucide-react"
import clsx from "clsx"

const columnHelper = createColumnHelper<Permission>()


export default function UserPermissionColums() {
    return [

        columnHelper.accessor('name', {
            header: '名称',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    {row.getCanExpand() ? (

                        <Button variant='secondary' className="bg-pink-400 w-5 h-5 hover:border-1 cursor-pointer hover:bg-pink-600" onClick={row.getToggleExpandedHandler()}>
                            {
                                row.getIsExpanded() ?
                                    <Minus color="white" /> :
                                    <Plus />
                            }
                        </Button>

                    ) : null}
                    {row.getValue('name')}
                </div>
            ),
        }),
        columnHelper.accessor('label', {
            header: '国际化标签',
        }),

        
        columnHelper.accessor('icon', {
            header: '图标',
            cell: (info) => {
                if (!info.getValue()) return null
                return <Icon icon={info.getValue()} size={18} />;
            }
        }),
        columnHelper.accessor('type', {
            header: '类型',
            cell: (info) => {
                return info.getValue() ?
                    <Badge className="bg-pink-400">界面</Badge> :
                    <Badge className="bg-pink-700">种类</Badge>
            }
        }),

        columnHelper.accessor('status', {
            header: '状态',
            cell: (info) => {
                const status = info.getValue();
                return (
                    <Badge className={clsx(status === PermissionBasicStatus.DISABLE ? "bg-pink-900" : "bg-pink-400")}>
                        {status === PermissionBasicStatus.DISABLE ? "禁用" : "启用"}
                    </Badge>
                );
            }
        }),

        columnHelper.accessor('order', {
            header: '顺序',
            cell: (info) => {
                return (
                    info.getValue() &&
                    <Badge variant='secondary'>
                        {info.getValue()}
                    </Badge>
                )
            }
        }),

        columnHelper.accessor('route', {
            header: '路由',
            cell: (info) => {
                const route = info.getValue();
                return route ? (
                    <span className='italic text-[12px]'>{ route }</span>
                ) : (
                    null
                );
            }
        }),

        columnHelper.accessor('component', {
            header: '位置',
            cell: (info) => {
                const component = info.getValue();
                return component ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-mono text-xs">
                        {component}
                    </Badge>
                ) : (
                    null
                );
            }
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
                                <DropdownMenuItem onClick={() => { }}>
                                    编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => { }}>
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