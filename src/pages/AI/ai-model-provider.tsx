import { useOpenRouterModel } from "@/hooks/use-model-provider"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import ModelProviderCard from "@/pages/AI/components/model-provider-card";
import { BorderLoading } from "@/components/loading";

export default function AIModelProviderPage() {
    const {
        paginatedModels,
        availableModelsIsLoading,
        currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nameFilter,
        totalItems,
        goToPage,
        nextPage,
        prevPage,
        setNameFilter
    } = useOpenRouterModel(6);

    if (availableModelsIsLoading) return <BorderLoading/>;

    return (
        <>
            <div className="w-full space-y-4">
                {/* 搜索筛选 */}
                <div className="px-4 flex space-x-2.5">
                    <Input
                        placeholder="搜索模型名称..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <div className="text-sm text-muted-foreground mt-2">
                        {totalItems} 个可用模型
                    </div>
                </div>

                {/* 模型列表 */}
                <ScrollArea className="h-[calc(90vh-150px)] w-full ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {
                            paginatedModels.map(item => {
                                return (
                                    <ModelProviderCard key={item.id} data={item} />
                                )
                            })
                        }
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>

                {/* 分页组件 */}
                {totalPages > 1 && (
                    <div className="flex justify-center px-4 pb-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={prevPage}
                                        className={!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() => goToPage(pageNum)}
                                                isActive={currentPage === pageNum}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={nextPage}
                                        className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

        </>
    );
}