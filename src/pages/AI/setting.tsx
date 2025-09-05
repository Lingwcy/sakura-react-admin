import Icon from "@/components/ui/icon";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { ModelProviderItem } from "@/types/ai";
import ModelProviderBrandCard from "./components/model-provider-brand-card";
import clsx from "clsx";
import { useModelProviderModal } from "@/hooks/use-model-provider";
import ModelProviderModal from "./components/model-provider-modal";
export default function AISettingPage() {
    const {
        editItem,
        open,
        handleCloseModal,
        handleOpenModal,
    } = useModelProviderModal()
    return (
        <>
            <div className="flex flex-row flex-wrap justify-center">
                <ModelProviderBrandContent>
                    {TEST_PROVIDER_LIST.map((provider) => (
                        <ModelProviderBrandCard openModelConfigModal={handleOpenModal} key={provider.id} item={provider} />

                    ))}
                    <Card className="border-dashed border-2 cursor-pointer hover:bg-secondary transition-all duration-200">
                        <CardContent className=" flex justify-center items-center space-y-2.5 flex-col">
                            <Icon icon="line-md:plus" size={32} />
                            <p className="font-bold text-md">添加自定义提供商</p>
                        </CardContent>
                    </Card>
                </ModelProviderBrandContent>
            </div>            
           <ModelProviderModal open={open} onClose={handleCloseModal} updateItem={editItem}/>

        </>
    )
}

interface ModelProvider {
    id: string,
    name: string,
    url: string,
    key?: string,
    variable?: string,
    models: ModelProviderItem[],

}

const TEST_PROVIDER_LIST: ModelProvider[] = [
    {
        id: 'open-router',
        name: 'OpenRouter',
        key: 'ev+dsakdjghsbnakma=',
        url: 'https://openrouter.ai/api/v1',
        models: [
            {
                "id": "deepcogito/cogito-v2-preview-llama-109b-moe",
                "canonical_slug": "deepcogito/cogito-v2-preview-llama-109b-moe",
                "hugging_face_id": "deepcogito/cogito-v2-preview-llama-109B-MoE",
                "name": "Cogito V2 Preview Llama 109B",
                "created": 1756831568,
                "description": "An instruction-tuned, hybrid-reasoning Mixture-of-Experts model built on Llama-4-Scout-17B-16E. Cogito v2 can answer directly or engage an extended “thinking” phase, with alignment guided by Iterated Distillation & Amplification (IDA). It targets coding, STEM, instruction following, and general helpfulness, with stronger multilingual, tool-calling, and reasoning performance than size-equivalent baselines. The model supports long-context use (up to 10M tokens) and standard Transformers workflows. Users can control the reasoning behaviour with the `reasoning` `enabled` boolean. [Learn more in our docs](https://openrouter.ai/docs/use-cases/reasoning-tokens#enable-reasoning-with-default-config)",
                "context_length": 32767,
                "architecture": {
                    "input_modalities": [
                        "image",
                        "text"
                    ],
                    "output_modalities": [
                        "text"
                    ],
                    "tokenizer": "Llama4",
                    "instruct_type": null
                },
                "pricing": {
                    "prompt": "0.00000018",
                    "completion": "0.00000059",
                    "request": "0",
                    "image": "0",
                    "web_search": "0",
                    "internal_reasoning": "0",
                    "input_cache_read": "0",
                    "input_cache_write": "0"
                },
                "top_provider": {
                    "context_length": 32767,
                    "max_completion_tokens": null,
                    "is_moderated": false
                },
                "per_request_limits": null,
                "supported_parameters": [
                    "frequency_penalty",
                    "include_reasoning",
                    "logit_bias",
                    "max_tokens",
                    "min_p",
                    "presence_penalty",
                    "reasoning",
                    "repetition_penalty",
                    "stop",
                    "temperature",
                    "tool_choice",
                    "tools",
                    "top_k",
                    "top_p"
                ]
            }
        ]
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
]


interface ModelProviderBrandContentProps {
    children: React.ReactNode
    className?: string
}

function ModelProviderBrandContent({
    children,
    className
}: ModelProviderBrandContentProps) {
    return (
        <div className={clsx(className, 'w-full border-0 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 p-0')}>
            {children}
        </div>
    )
}


