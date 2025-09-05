interface ModelProviderItem {
    id: string;                           // 模型在 OpenRouter 内部的唯一标识
    name: string;                         // 人类可读的模型名称（如 "GPT-4 Turbo"）
    created: number;                      // 模型上线时间，Unix 时间戳（秒）
    description: string;                  // 模型的简短描述或宣传语
    architecture: {
        input_modalities: Array<"text" | "image">; // 模型可接收的输入类型：文本、图片
        output_modalities: Array<"text">;          // 模型可生成的输出类型，目前仅文本
        tokenizer: string;                  // 分词器名称，如 "GPT"、"Llama"
        instruct_type: string;              // 指令微调方式，如 "chat"、"instruct"
    };
    top_provider: {
        is_moderated: boolean;              // 该模型是否启用内容审核
        context_length: number;             // 模型支持的最大上下文长度（token 数）
        max_completion_tokens: number;      // 单次返回生成的最大 token 数
    };
    pricing: {
        prompt: string;                     // 输入端每个 token 的价格（美元，字符串格式）
        completion: string;                 // 输出端每个 token 的价格（美元，字符串格式）
        image: string;                      // 图片输入单价（美元，字符串格式）
        request: string;                    // 每次请求固定费用（美元，字符串格式）
        web_search: string;                 // 启用网络搜索的额外费用（美元，字符串格式）
        internal_reasoning: string;         // 启用内部推理的额外费用（美元，字符串格式）
        input_cache_read: string;           // 读取输入缓存的价格（美元，字符串格式）
        input_cache_write: string;          // 写入输入缓存的价格（美元，字符串格式）
    };
    canonical_slug: string;               // 模型的规范英文别名，用于 URL 或命令行
    context_length: number;               // 模型最大上下文长度（与 top_provider 中相同，冗余字段）
    hugging_face_id: string;              // Hugging Face 上的模型 ID（若存在）
    per_request_limits: Record<string, unknown>; // 各维度请求限速（如 RPM、TPM），结构动态
    supported_parameters: Array<string>;  // 模型支持的推理参数列表，如 temperature、top_p 等
}


interface ModelProvider {
    id: string,
    name: string,
    url: string,
    key?: string,
    variable?: string,
    models: ModelProviderItem[],

}

export {
    ModelProviderItem,
    ModelProvider
}