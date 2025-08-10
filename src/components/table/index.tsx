
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel,
    getExpandedRowModel,
} from "@tanstack/react-table"
import type { SortingState, VisibilityState, ColumnDef } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
interface SakuraTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowSelection?: Record<string, boolean>
    enablePagination?: boolean
    onRowSelectionChange?: (row: React.SetStateAction<Record<string, boolean>>) => void
    serverPagination?: {
        totalPages: number,
        currentPage: number,
        totalCount: number,
        setPage?: (page: number) => void,
        getPage?: number
    }
}

export function SakuraTable<TData extends { id: string, children?: TData[] }, TValue>({
    columns,
    data,
    serverPagination,
    enablePagination = false,
    onRowSelectionChange,
    rowSelection,
}: SakuraTableProps<TData, TValue>) {

    // 可见性状态
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    // 排序状态
    const [sorting, setSorting] = React.useState<SortingState>([])
    // 内部行选择状态（当没有外部传入时使用）
    const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string, boolean>>({})
    // 避免表格数据重渲染缓存，并确保每个数据项都有id
    const safeData = React.useMemo(() => {
        const dataArray = data || []
        // 验证数据项是否有id属性，如果没有则生成一个
        return dataArray.map((item, index) => {
            if (!item || typeof item !== 'object') {
                console.warn(`SakuraTable: 此表格数据可能没有id字段 ${index}:`, item)
                return { id: `回调-${index}`, ...item }
            }
            if (!item.id) {
                console.warn(`SakuraTable: 数据项 ${index} 缺少id字段:`, item)
                return { id: `生成-${index}`, ...item }
            }
            return item
        })
    }, [data])

    // 使用外部传入的rowSelection，如果没有则使用内部状态
    const currentRowSelection = rowSelection ?? internalRowSelection
    const currentOnRowSelectionChange = onRowSelectionChange ?? setInternalRowSelection

    const table = useReactTable({
        data: safeData,
        columns: columns || [],
        manualPagination: false,
        getRowId: (origin) => origin.id,
        getSubRows: (row) => row.children,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        onRowSelectionChange: currentOnRowSelectionChange,
        initialState:{
            pagination:{
                pageSize: Number.MAX_SAFE_INTEGER
            }
        },
        state: {
            sorting,
            columnVisibility,
            rowSelection: currentRowSelection
        },
    })


    return (
        <div className="flex flex-col">

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
                                    data-state={row.getIsSelected && row.getIsSelected() ? "selected" : "unselected"}
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
                                <TableCell colSpan={columns?.length || 1} className="h-24 text-center">
                                    没有结果
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center space-x-2 py-4 justify-center">
                {
                    enablePagination && <Pagination>
                        <PaginationContent>
                            {serverPagination ? (
                                // 服务器端分页
                                <>
                                    <PaginationItem
                                        onClick={() => {
                                            if (serverPagination.currentPage > 1) {
                                                serverPagination.setPage(serverPagination.currentPage - 1);
                                            }
                                        }}
                                    >
                                        <PaginationPrevious
                                            href="#"
                                            className={serverPagination.currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>

                                    {/* 服务器端页码按钮 */}
                                    {(() => {
                                        const totalPages = serverPagination.totalPages;
                                        const currentPage = serverPagination.currentPage;
                                        const maxVisiblePages = 10;

                                        // 计算显示的页码范围
                                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                        // 调整起始页码如果接近末尾
                                        if (endPage - startPage + 1 < maxVisiblePages) {
                                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                        }

                                        const pages = [];
                                        for (let i = startPage; i <= endPage; i++) {
                                            pages.push(
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={() => serverPagination.setPage && serverPagination.setPage(i)}
                                                        className={i === currentPage ? 'bg-primary text-primary-foreground' : ''}
                                                    >
                                                        {i}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        }

                                        return pages;
                                    })()}

                                    <PaginationItem
                                        onClick={() => {
                                            if (serverPagination.currentPage < serverPagination.totalPages && serverPagination.setPage) {
                                                serverPagination.setPage(serverPagination.currentPage + 1);
                                            }
                                        }}
                                    >
                                        <PaginationNext
                                            href="#"
                                            className={serverPagination.currentPage >= serverPagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </>
                            ) : (
                                // 客户端分页（原有逻辑）
                                <>
                                    <PaginationItem onClick={() => table.previousPage()}>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
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
                                                <PaginationItem key={i}>
                                                    <PaginationLink onClick={() => table.setPageIndex(i)} >{i + 1}</PaginationLink>
                                                </PaginationItem>
                                            );
                                        }

                                        return pages;
                                    })()}
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem onClick={() => table.nextPage()}>
                                        <PaginationNext href="#" />
                                    </PaginationItem>
                                </>
                            )}
                        </PaginationContent>
                    </Pagination>
                }

            </div>
        </div>
    )
}