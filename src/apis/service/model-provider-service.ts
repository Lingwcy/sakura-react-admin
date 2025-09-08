import { requestClient } from "@/utils";
import type { ModelProvider, ModelProviderItem } from "@/types/ai";
import { apiList } from "../api-list";

type ModelProviderListResponse = {
    currentPage: number,
    size: number,
    totalCount: number,
    totalPages: number,
    providers: ModelProvider[]
}

type ModelProviderResponse = {
    data: ModelProvider,
    code: number,
    message: string
}

type NextIdResponse = {
    data: { id: string },
}

type ModelResponse = {
    data: ModelProviderItem,
}
type ModelsListResponse = {
    data: ModelProviderItem[],
}

type AddedModelItem = {
    providerId: string;
    providerName: string;
    modelId: string;
    modelName: string;
};
type AddedModelsResponse = {
    items: AddedModelItem[];
    modelIds: string[];
}

// 获取模型提供商列表
const getModelProviderList = async (page = 1, name?: string) => {
    try {
        // 修改: 仅在 name 有效时才传给后端
        const params: Record<string, any> = { page };
        if (name && name.trim()) params.name = name.trim();
        const response = await requestClient.get<ModelProviderListResponse>({
            url: `${apiList.modelProvider.getLocalModelProvider}`,
            params,
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 根据ID获取单个模型提供商
const getModelProviderById = async (id: string) => {
    try {
        const response = await requestClient.get<ModelProviderResponse>({
            url: `${apiList.modelProvider.updateLocalModelProvider}/${id}`,
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 创建模型提供商
const createModelProvider = async (provider: ModelProvider) => {
    try {
        const response = await requestClient.post<ModelProviderResponse>({
            url: `${apiList.modelProvider.createLocalModelProvider}`,
            data: provider
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 更新模型提供商
const updateModelProvider = async ({ id, provider }: { id: string, provider: Partial<ModelProvider> }) => {
    try {
        const response = await requestClient.put<ModelProviderResponse>({
            url: `${apiList.modelProvider.updateLocalModelProvider}/${id}`,
            data: provider
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 删除单个模型提供商
const deleteModelProvider = async (id: string) => {
    try {
        const response = await requestClient.delete<ModelProviderResponse>({
            url: `${apiList.modelProvider.deleteLocalModelProvider}/${id}`,
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 批量删除模型提供商
const deleteModelProviders = async (ids: string[]) => {
    try {
        const response = await requestClient.delete({
            url: `${apiList.modelProvider.deleteLocalModelProvider}s/${ids.join(',')}`,
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// 获取下一个可用的提供商ID
const getNextProviderId = async () => {
    try {
        const response = await requestClient.get<NextIdResponse>({
            url: `${apiList.modelProvider.getNextProviderId}`,
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

// ========== 模型相关API ==========

// 获取指定提供商的所有模型
const getModelsByProviderId = async (providerId: string) => {
    try {
        const response = await requestClient.get<ModelsListResponse>({
            url: `${apiList.modelProvider.getModels}/${providerId}/models`,
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 根据模型ID获取单个模型
const getModelById = async (providerId: string, modelId: string) => {
    try {
        const response = await requestClient.get<ModelResponse>({
            url: `${apiList.modelProvider.getModel}/${providerId}/model/${modelId}`,
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 创建模型
const createModel = async (providerId: string, model: ModelProviderItem) => {
    try {
        const response = await requestClient.post<ModelResponse>({
            url: `${apiList.modelProvider.createModel}/${providerId}/model`,
            data: model
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 更新模型
const updateModel = async (providerId: string, modelId: string, model: Partial<ModelProviderItem>) => {
    try {
        const response = await requestClient.put<ModelResponse>({
            url: `${apiList.modelProvider.updateModel}/${providerId}/model/${modelId}`,
            data: model
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 删除单个模型
const deleteModel = async (providerId: string, modelId: string) => {
    try {
        const response = await requestClient.delete<ModelResponse>({
            url: `${apiList.modelProvider.deleteModel}/${providerId}/model/${modelId}`,
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 批量删除模型
const deleteModels = async (providerId: string, modelIds: string[]) => {
    try {
        const response = await requestClient.delete({
            url: `${apiList.modelProvider.deleteModels}/${providerId}/models/${modelIds.join(',')}`,
        });
        return response;
    } catch (error) {
        console.error("Model API error:", error);
        throw error;
    }
};

// 获取所有已添加的本地模型（含提供商信息）
const getAddedLocalModels = async () => {
    try {
        const response = await requestClient.get<AddedModelsResponse>({
            url: apiList.modelProvider.getAddedModels
        });
        return response;
    } catch (error) {
        console.error("Model Provider API error:", error);
        throw error;
    }
};

export {
    getModelProviderList,
    getModelProviderById,
    createModelProvider,
    updateModelProvider,
    deleteModelProvider,
    deleteModelProviders,
    getNextProviderId,
    getModelsByProviderId,
    getModelById,
    createModel,
    updateModel,
    deleteModel,
    deleteModels,
    getAddedLocalModels // 新增导出
};
