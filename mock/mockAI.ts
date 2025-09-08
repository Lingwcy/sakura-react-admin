import { ModelProvider, ModelProviderItem } from '@/types/ai';

const TEST_PROVIDER_LIST: ModelProvider[] = [
    {
        id: 'open-router',
        name: 'OpenRouter',
        key: 'ev+dsakdjghsbnakma=',
        url: 'https://openrouter.ai/api/v1',
        models: []
    },
    {
        id: 'openai',
        name: 'OpenAI',
        key: 'sk-xxxxxxxxxxxxx',
        url: 'https://api.openai.com/v1',
        models: []
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        key: 'sk-ant-xxxxxxxxxxxxx',
        url: 'https://api.anthropic.com',
        models: []
    },
    {
        id: 'google',
        name: 'Google AI',
        url: 'https://generativelanguage.googleapis.com/v1',
        models: []
    }
];

// AI 模型提供商数据管理类
class ModelProviderManager {
    private providers: ModelProvider[] = [...TEST_PROVIDER_LIST];

    // 获取所有提供商
    getAllProviders() {
        return [...this.providers];
    }

    // 根据ID获取提供商
    getProviderById(id: string) {
        return this.providers.find(p => p.id === id);
    }

    // 添加提供商
    addProvider(provider: ModelProvider) {
        // 检查ID是否已存在
        if (this.providers.find(p => p.id === provider.id)) {
            throw new Error('提供商ID已存在');
        }

        this.providers.push(provider);
        return provider;
    }

    // 更新提供商
    updateProvider(id: string, updates: Partial<ModelProvider>) {
        const index = this.providers.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('提供商不存在');
        }

        // 过滤掉空值和id字段
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key, value]) =>
                value !== undefined && value !== '' && value !== null && key !== 'id'
            )
        );

        this.providers[index] = { ...this.providers[index], ...filteredUpdates };
        return this.providers[index];
    }

    // 删除提供商
    deleteProvider(id: string) {
        const index = this.providers.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('提供商不存在');
        }

        const deleted = this.providers[index];
        this.providers.splice(index, 1);
        return deleted;
    }

    // 批量删除提供商
    deleteProviders(ids: string[]) {
        const deleted: ModelProvider[] = [];

        for (const id of ids) {
            try {
                const deletedProvider = this.deleteProvider(id);
                deleted.push(deletedProvider);
            } catch (error) {
                console.warn(`删除提供商 ${id} 失败:`, error);
            }
        }

        return deleted;
    }

    // 生成下一个可用ID
    getNextProviderId(): string {
        const existingIds = this.providers.map(p => p.id);
        let counter = 1;
        let newId = `provider-${counter}`;
        
        while (existingIds.includes(newId)) {
            counter++;
            newId = `provider-${counter}`;
        }
        
        return newId;
    }

    // 获取指定提供商的所有模型
    getModelsByProviderId(providerId: string) {
        const provider = this.getProviderById(providerId);
        if (!provider) {
            throw new Error('提供商不存在');
        }
        return provider.models || [];
    }

    // 根据模型ID获取模型（需要指定提供商ID）
    getModelById(providerId: string, modelId: string) {
        const models = this.getModelsByProviderId(providerId);
        return models.find(m => m.id === modelId);
    }

    // 添加模型到指定提供商
    addModel(providerId: string, model: ModelProviderItem) {
        const provider = this.getProviderById(providerId);
        if (!provider) {
            throw new Error('提供商不存在');
        }

        // 检查模型ID是否已存在
        if (provider.models?.find(m => m.id === model.id)) {
            throw new Error('模型ID已存在');
        }

        if (!provider.models) {
            provider.models = [];
        }

        provider.models.push(model);
        return model;
    }

    // 更新指定提供商的模型
    updateModel(providerId: string, modelId: string, updates: Partial<ModelProviderItem>) {
        const provider = this.getProviderById(providerId);
        if (!provider) {
            throw new Error('提供商不存在');
        }

        if (!provider.models) {
            throw new Error('该提供商没有模型');
        }

        const modelIndex = provider.models.findIndex(m => m.id === modelId);
        if (modelIndex === -1) {
            throw new Error('模型不存在');
        }

        // 过滤掉空值和id字段
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key, value]) =>
                value !== undefined && value !== '' && value !== null && key !== 'id'
            )
        );

        provider.models[modelIndex] = { ...provider.models[modelIndex], ...filteredUpdates };
        return provider.models[modelIndex];
    }

    // 删除指定提供商的模型
    deleteModel(providerId: string, modelId: string) {
        const provider = this.getProviderById(providerId);
        if (!provider) {
            throw new Error('提供商不存在');
        }

        if (!provider.models) {
            throw new Error('该提供商没有模型');
        }

        const modelIndex = provider.models.findIndex(m => m.id === modelId);
        if (modelIndex === -1) {
            throw new Error('模型不存在');
        }

        const deletedModel = provider.models[modelIndex];
        provider.models.splice(modelIndex, 1);
        return deletedModel;
    }

    // 批量删除指定提供商的模型
    deleteModels(providerId: string, modelIds: string[]) {
        const provider = this.getProviderById(providerId);
        if (!provider) {
            throw new Error('提供商不存在');
        }

        const deleted: ModelProviderItem[] = [];

        for (const modelId of modelIds) {
            try {
                const deletedModel = this.deleteModel(providerId, modelId);
                deleted.push(deletedModel);
            } catch (error) {
                console.warn(`删除模型 ${modelId} 失败:`, error);
            }
        }

        return deleted;
    }

    // 聚合所有已添加的模型（含提供商信息）
    getAllAddedModels() {
        return this.providers.flatMap(p =>
            (p.models || []).map(m => ({
                providerId: p.id,
                providerName: p.name,
                modelId: m.id,
                modelName: m.name
            }))
        );
    }
}

// 创建模型提供商管理器实例
export const modelProviderManager = new ModelProviderManager();
