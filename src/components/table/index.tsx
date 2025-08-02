import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table"
import type { SortingState, ColumnFiltersState, VisibilityState, ColumnDef } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"

interface SakuraTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder: string,
    searchKey: string,
    onClickCreate: () => void,


}

export function SakuraTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder,
    searchKey,
    onClickCreate,
}: SakuraTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })


    return (
        <div className="flex flex-col">
            <div className="flex py-4 space-x-1.5">
                <Input
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            属性筛选
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
                <Button variant="outline" className="bg-pink-900 text-white" onClick={onClickCreate}>
                    新增服务器
                </Button>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    没有结果
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center space-x-2 py-4 justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    上一页
                </Button>

                {/* 页码按钮 */}
                {(() => {
                    const pageCount = table.getPageCount();
                    const currentPage = table.getState().pagination.pageIndex;
                    const maxVisiblePages = 10;

                    // 计算显示的页码范围
                    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
                    const endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

                    // 调整起始页码如果接近末尾
                    if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(0, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                            <Button
                                key={i}
                                variant={i === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(i)}
                            >
                                {i + 1}
                            </Button>
                        );
                    }

                    return pages;
                })()}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    下一页
                </Button>
            </div>
        </div>
    )
}