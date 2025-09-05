
import request from "@/utils/request";
import { apiList } from "../api-list";
import { ModelProviderItem } from "@/types/ai";

interface AvailableModelsResponse {
  data: Array<ModelProviderItem>;
}

const getAvailableModels  =  async() => {
    try {
        const response = await request.get<AvailableModelsResponse>({
            url: apiList.openRouter.listAvailableModels,
        });
        return response;
    } catch (error) {
        console.error("Product API error:", error);
        throw error;
    }
}

export {
    getAvailableModels
}