import { getAvailableModels } from "@/apis/service/open-router-service"
import { 
    getModelProviderList, 
    createModelProvider, 
    updateModelProvider, 
    deleteModelProvider,
    getNextProviderId,
    // 添加模型相关导入
    getModelsByProviderId,
    getModelById,
    createModel,
    updateModel,
    deleteModel,
    deleteModels,
    getAddedLocalModels
} from "@/apis/service/model-provider-service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { ModelProvider, ModelProviderItem } from "@/types/ai"
import { toast } from "sonner"


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

const useModelProviderItem = (providerId?: string) => {
    const [selectedModels, setSelectedModels] = useState<string[]>([])
    const queryClient = useQueryClient()

    // 获取指定提供商的模型列表
    const {
        data: modelsData,
        isLoading: modelsLoading,
        error: modelsError
    } = useQuery({
        queryKey: ['providerModels', providerId],
        queryFn: () => providerId ? getModelsByProviderId(providerId) : Promise.resolve({ data: [] }),
        enabled: !!providerId,
        staleTime: 1000 * 60 * 5,
    })

    // 获取单个模型
    const getModel = (modelId: string) => {
        return useQuery({
            queryKey: ['providerModel', providerId, modelId],
            queryFn: () => providerId && modelId ? getModelById(providerId, modelId) : Promise.resolve(null),
            enabled: !!(providerId && modelId),
            staleTime: 1000 * 60 * 5,
        })
    }

    // 获取所有已添加到本地的模型ID集合（跨 provider）
    const {
        data: addedModelsData,
        isLoading: addedModelsLoading,
        error: addedModelsError
    } = useQuery({
        queryKey: ['addedLocalModels'],
        queryFn: getAddedLocalModels,
        staleTime: 1000 * 60, // 1 分钟缓存
    })

    // 归一化已添加模型ID列表
    const addedModelIds = useMemo(() => {
        const raw: any = addedModelsData
        if (!raw) return []
        if (Array.isArray(raw.modelIds)) return raw.modelIds
        if (raw.data && Array.isArray(raw.data.modelIds)) return raw.data.modelIds
        return []
    }, [addedModelsData])

    const isModelAdded = (id: string) => addedModelIds.includes(id)

    // 创建模型
    const createMutation = useMutation({
        mutationFn: ({ model }: { model: ModelProviderItem }) => {
            if (!providerId) throw new Error('提供商ID不能为空')
            return createModel(providerId, model)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerModels', providerId] })
            queryClient.invalidateQueries({ queryKey: ['addedLocalModels'] }) // 新增
            toast.success('模型创建成功')
        },
        onError: (error: any) => {
            toast.error(`创建失败: ${error?.message || '未知错误'}`)
        }
    })

    // 更新模型
    const updateMutation = useMutation({
        mutationFn: ({ modelId, model }: { modelId: string, model: Partial<ModelProviderItem> }) => {
            if (!providerId) throw new Error('提供商ID不能为空')
            return updateModel(providerId, modelId, model)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerModels', providerId] })
            queryClient.invalidateQueries({ queryKey: ['providerModel', providerId] })
            toast.success('模型更新成功')
        },
        onError: (error: any) => {
            toast.error(`更新失败: ${error?.message || '未知错误'}`)
        }
    })

    // 删除单个模型
    const deleteMutation = useMutation({
        mutationFn: (modelId: string) => {
            if (!providerId) throw new Error('提供商ID不能为空')
            return deleteModel(providerId, modelId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['providerModels', providerId] })
            queryClient.invalidateQueries({ queryKey: ['addedLocalModels'] }) // 新增
            toast.success('模型删除成功')
        },
        onError: (error: any) => {
            toast.error(`删除失败: ${error?.message || '未知错误'}`)
        }
    })

    // 批量删除模型
    const batchDeleteMutation = useMutation({
        mutationFn: (modelIds: string[]) => {
            if (!providerId) throw new Error('提供商ID不能为空')
            return deleteModels(providerId, modelIds)
        },
        onSuccess: (data, modelIds) => {
            queryClient.invalidateQueries({ queryKey: ['providerModels', providerId] })
            queryClient.invalidateQueries({ queryKey: ['addedLocalModels'] }) // 新增
            toast.success(`成功删除 ${modelIds.length} 个模型`)
            setSelectedModels([]) // 清空选中状态
        },
        onError: (error: any) => {
            toast.error(`批量删除失败: ${error?.message || '未知错误'}`)
        }
    })

    // 操作方法
    const handleCreateModel = async (model: ModelProviderItem) => {
        await createMutation.mutateAsync({ model })
    }

    const handleUpdateModel = async (modelId: string, model: Partial<ModelProviderItem>) => {
        await updateMutation.mutateAsync({ modelId, model })
    }

    const handleDeleteModel = async (modelId: string) => {
        await deleteMutation.mutateAsync(modelId)
    }

    const handleBatchDeleteModels = async (modelIds?: string[]) => {
        const idsToDelete = modelIds || selectedModels
        if (idsToDelete.length === 0) {
            toast.warning('请选择要删除的模型')
            return
        }
        await batchDeleteMutation.mutateAsync(idsToDelete)
    }

    // 选择管理
    const handleSelectModel = (modelId: string) => {
        setSelectedModels(prev => 
            prev.includes(modelId) 
                ? prev.filter(id => id !== modelId)
                : [...prev, modelId]
        )
    }

    const handleSelectAllModels = () => {
        const allModelIds = modelsData?.data?.map((model: ModelProviderItem) => model.id) || []
        setSelectedModels(prev => 
            prev.length === allModelIds.length ? [] : allModelIds
        )
    }

    const clearSelection = () => {
        setSelectedModels([])
    }

    // 归一化模型数据
    const models = useMemo(() => {
        const raw: any = modelsData
        if (!raw) return []
        if (Array.isArray(raw)) return raw
        if (raw.data && Array.isArray(raw.data)) return raw.data
        return []
    }, [modelsData])

    return {
        // 数据
        models,
        selectedModels,
        providerId,
        // 已添加模型相关
        addedModelIds,
        isModelAdded,
        addedModelsLoading,
        addedModelsError,
        // 加载状态
        isLoading: modelsLoading,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isBatchDeleting: batchDeleteMutation.isPending,
        
        // 错误状态
        error: modelsError,
        
        // 操作方法
        handleCreateModel,
        handleUpdateModel,
        handleDeleteModel,
        handleBatchDeleteModels,
        
        // 选择管理
        handleSelectModel,
        handleSelectAllModels,
        clearSelection,
        
        // 工具方法
        getModel,
        
        // 计算属性
        hasSelectedModels: selectedModels.length > 0,
        selectedCount: selectedModels.length,
        totalCount: models.length,
        isAllSelected: selectedModels.length === models.length && models.length > 0
    }
}

const useModelProvider = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [nameFilter, setNameFilter] = useState('')
    const queryClient = useQueryClient()

    // 获取模型提供商列表
    const {
        data: providersData,
        isLoading: providersLoading,
        error: providersError
    } = useQuery({
        queryKey: ['modelProviders', currentPage, nameFilter],
        // 修改: 仅在有值时传递 name
        queryFn: () => getModelProviderList(currentPage, nameFilter.trim() ? nameFilter.trim() : undefined),
        staleTime: 1000 * 60 * 5,
    })

    // 获取下一个可用ID
    const { data: nextIdData } = useQuery({
        queryKey: ['nextProviderId'],
        queryFn: getNextProviderId,
        staleTime: 1000 * 60 * 5,
    })

    // 归一化 providers 数据结构
    const normalized = (() => {
        const raw: any = providersData;
        if (!raw) return undefined;
        if (raw.providers) return raw;                 // 顶层直接返回
        if (raw.data && raw.data.providers) return raw.data; // 包裹在 data 下
        return raw;
    })();


    const nextId = (nextIdData as any)?.data?.id ?? (nextIdData as any)?.id;

    // 创建模型提供商
    const createMutation = useMutation({
        mutationFn: createModelProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modelProviders'] })
            queryClient.invalidateQueries({ queryKey: ['nextProviderId'] })
            toast.success('模型提供商创建成功')
        },
        onError: (error: any) => {
            toast.error(`创建失败: ${error?.message || '未知错误'}`)
        }
    })

    // 更新模型提供商
    const updateMutation = useMutation({
        mutationFn: updateModelProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modelProviders'] })
            toast.success('模型提供商更新成功')
        },
        onError: (error: any) => {
            toast.error(`更新失败: ${error?.message || '未知错误'}`)
        }
    })

    // 删除模型提供商
    const deleteMutation = useMutation({
        mutationFn: deleteModelProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modelProviders'] })
            toast.success('模型提供商删除成功')
        },
        onError: (error: any) => {
            toast.error(`删除失败: ${error?.message || '未知错误'}`)
        }
    })

    // 辅助: 生成 provider id
    const slugify = (name: string) =>
        name.toLowerCase().trim()
            .replace(/[\s_]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 40) || 'provider';

    // 根据模型推断提供商名称（可按需扩展）
    const inferProviderName = (model: ModelProviderItem) => {
        const id = model.id.toLowerCase();
        const name = model.name?.toLowerCase() || id;
        if (id.includes('gpt') || name.includes('gpt')) return 'OpenAI';
        if (id.includes('claude') || name.includes('claude')) return 'Anthropic';
        if (id.includes('gemini') || name.includes('gemini')) return 'Google';
        if (id.includes('llama')) return 'Llama';
        if (id.includes('deepseek')) return 'DeepSeek';
        if (id.includes('mistral')) return 'Mistral';
        const seg = id.split('/')[0];
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    };

    // 已添加模型(放在这里保证云端列表也能共享缓存)
    const {
        data: addedModelsData,
        isLoading: addedModelsLoading,
        error: addedModelsError
    } = useQuery({
        queryKey: ['addedLocalModels'],
        queryFn: getAddedLocalModels,
        staleTime: 1000 * 60
    })

    const addedModelIds = useMemo(() => {
        const raw: any = addedModelsData
        if (!raw) return []
        if (Array.isArray(raw.modelIds)) return raw.modelIds
        if (raw.data && Array.isArray(raw.data.modelIds)) return raw.data.modelIds
        return []
    }, [addedModelsData])

    const isModelAdded = (id: string) => addedModelIds.includes(id)

    // 添加云端模型到本地
    const addCloudModelToLocal = async (cloudModel: ModelProviderItem) => {
        try {
            if (!cloudModel?.id) {
                toast.error('模型数据不完整')
                return
            }
            let target = (normalized?.providers || []).find(p => p.id === 'open-router')
            if (!target) {
                const createPayload: ModelProvider = {
                    id: 'open-router',
                    name: 'OpenRouter',
                    url: 'https://openrouter.ai/api/v1',
                    models: []
                }
                await createMutation.mutateAsync(createPayload)
                await queryClient.invalidateQueries({ queryKey: ['modelProviders'] })
                const latest = queryClient.getQueryData<any>(['modelProviders', currentPage, nameFilter])
                const list = latest?.providers || latest?.data?.providers || []
                target = list.find((p: ModelProvider) => p.id === 'open-router') || createPayload
            }
            if (target.models?.some(m => m.id === cloudModel.id)) {
                toast.info('该模型已在本地 OpenRouter')
                return
            }
            const normalizedModel: ModelProviderItem = {
                ...cloudModel,
                architecture: cloudModel.architecture || {
                    input_modalities: ['text'],
                    output_modalities: ['text'],
                    tokenizer: '',
                    instruct_type: null
                },
                top_provider: cloudModel.top_provider || {
                    context_length: cloudModel.context_length || 8192,
                    max_completion_tokens: null,
                    is_moderated: false
                },
                supported_parameters: cloudModel.supported_parameters || []
            }
            await createModel(target.id, normalizedModel)
            // 失效两个列表：提供商下模型 & 已添加聚合
            queryClient.invalidateQueries({ queryKey: ['providerModels', target.id] })
            queryClient.invalidateQueries({ queryKey: ['addedLocalModels'] })
            toast.success('模型已添加到 OpenRouter')
        } catch (e: any) {
            toast.error(`添加失败: ${e?.message || '未知错误'}`)
        }
    }

    const setNameFilterAndReset = (name: string) => {
        setNameFilter(name)
        setCurrentPage(1)
    }

    const clearNameFilter = () => {
        setNameFilter('')
        setCurrentPage(1)
    }

    // ====== 包装 CRUD 方法以匹配组件期望的函数签名 ======
    const handleCreate = async (provider: ModelProvider) => {
        await createMutation.mutateAsync(provider)
    }
    const handleUpdateProvider = async (id: string, provider: Partial<ModelProvider>) => {
        await updateMutation.mutateAsync({ id, provider })
    }
    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id)
    }

    return {
        providers: normalized?.providers || [],
        currentPage: normalized?.currentPage || 1,
        totalPages: normalized?.totalPages || 0,
        totalCount: normalized?.totalCount || 0,
        pageSize: normalized?.size || 10,
        nextId,
        
        // 加载状态
        isLoading: providersLoading,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        
        // 错误状态
        error: providersError,
        
        // 筛选状态
        nameFilter,
        
        // 操作方法 (提供两种名称以兼容不同调用处)
        handleCreate,
        handleUpdate: handleUpdateProvider,
        handleEdit: handleUpdateProvider,
        handleDelete,
        
        // 分页方法
        setCurrentPage,
        setNameFilter: setNameFilterAndReset,
        clearNameFilter,

        // 新增导出
        addCloudModelToLocal,

        // 已添加模型状态（供云端卡片直接判定）
        addedModelIds,
        isModelAdded,
        addedModelsLoading,
        addedModelsError,
    }
}


export {
    useOpenRouterModel,
    useModelProviderModal,
    useModelProvider,
    useModelProviderItem
}