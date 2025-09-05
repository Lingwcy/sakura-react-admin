import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";
import { ModelProvider } from "@/types/ai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
interface ModelProviderBrandCardProps {
    item: ModelProvider
    openModelConfigModal: (item?: ModelProvider) => void
    
}
export default function ModelProviderBrandCard({ item, openModelConfigModal }: ModelProviderBrandCardProps) {
    return (
        <>
            <Card className="w-l">
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <span className="text-2xl">{item.name}</span>
                        <div className="space-x-1">
                            <Button className="cursor-pointer w-18 h-7">
                                <span className="text-xs">模型</span>
                                <Icon icon="carbon:model-alt" size={18} />
                            </Button>
                            <Button className="cursor-pointer w-18 h-7" onClick={() => openModelConfigModal(item)}>
                                <span className="text-xs">配置</span>
                                <Icon icon="line-md:menu-unfold-right" size={18} />
                            </Button>
                        </div>
                    </CardTitle>
                    <CardDescription className="flex space-x-2.5">
                        <Badge variant="secondary">
                            <span className="font-medium select-none">可用模型: 16 个</span>
                        </Badge>
                        {item.key ?
                            <Badge variant="destructive">
                                <span className="font-medium select-none"> 需要配置 </span>
                            </Badge>
                            :
                            <Badge variant="default">
                                <span className="font-medium select-none"> 就绪 </span>
                            </Badge>}
                    </CardDescription>
                </CardHeader>
            </Card>
         </>
    )
}