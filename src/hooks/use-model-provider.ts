import { getAvailableModels } from "@/apis/service/open-router-service"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { ModelProvider } from "@/types/ai"


const useOpenRouterModel = (pageSize: number = 12) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [nameFilter, setNameFilter] = useState('')

    const availableModels = useQuery({
        queryKey: ['availableModels-openRouter'],
        queryFn: getAvailableModels,
        staleTime: 1000 * 60 * 10,   // 10 分钟
        refetchOnWindowFocus: false,
    })

    const paginatedData = useMemo(() => {
        if (!availableModels.data?.data) {
            return {
                data: [],
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
            }
        }

        // 先根据名称筛选
        const filteredData = availableModels.data.data.filter(item =>
            nameFilter ? item.name?.toLowerCase().includes(nameFilter.toLowerCase()) : true
        )

        const total = filteredData.length
        const totalPages = Math.ceil(total / pageSize)
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const data = filteredData.slice(startIndex, endIndex)

        return {
            data,
            total,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        }
    }, [availableModels.data?.data, currentPage, pageSize, nameFilter])

    const goToPage = (page: number) => {
        if (page >= 1 && page <= paginatedData.totalPages) {
            setCurrentPage(page)
        }
    }

    const nextPage = () => {
        if (paginatedData.hasNextPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const prevPage = () => {
        if (paginatedData.hasPrevPage) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const resetPage = () => {
        setCurrentPage(1)
    }

    const setNameFilterAndReset = (name: string) => {
        setNameFilter(name)
        setCurrentPage(1) // 筛选时重置到第一页
    }

    const clearNameFilter = () => {
        setNameFilter('')
        setCurrentPage(1)
    }

    return {
        availableModels: availableModels.data,
        availableModelsIsLoading: availableModels.isLoading,
        // 分页数据
        paginatedModels: paginatedData.data,
        currentPage,
        pageSize,
        totalItems: paginatedData.total,
        totalPages: paginatedData.totalPages,
        hasNextPage: paginatedData.hasNextPage,
        hasPrevPage: paginatedData.hasPrevPage,
        // 筛选状态
        nameFilter,
        // 分页方法
        goToPage,
        nextPage,
        prevPage,
        resetPage,
        // 筛选方法
        setNameFilter: setNameFilterAndReset,
        clearNameFilter
    }
}


const useModelProviderModal = () => {
    const [open, SetOpen] = useState(false)
    const [editItem, SetEditItem] = useState<ModelProvider>()

    const handleCloseModal = () => {
        SetEditItem(undefined)
        SetOpen(false)
    }

    const handleOpenModal = (item?: ModelProvider) => {
        SetEditItem(item ?? undefined)
        SetOpen(true)
    }

    return {
        handleCloseModal,
        handleOpenModal,
        open,
        editItem
    }
}

export {
    useOpenRouterModel,
    useModelProviderModal
}