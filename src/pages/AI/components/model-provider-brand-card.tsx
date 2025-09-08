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
import LocalModelProivderContentSheet from "./local-model-provider-content-sheet";
interface ModelProviderBrandCardProps {
    item: ModelProvider
    openModelConfigModal: (item?: ModelProvider) => void
    
}
export default function ModelProviderBrandCard({ item, openModelConfigModal }: ModelProviderBrandCardProps) {
    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="p-0">
                        {/* 改为响应式 grid，避免 lg 下按钮溢出 */}
                        <div className="w-full grid gap-2 sm:grid-cols-[1fr_auto] items-start sm:items-center">
                            <div className="min-w-0">
                                <span className="text-2xl px-2 py-1 block truncate">{item.name}</span>
                            </div>
                            <div className="flex md:flex-col items-center gap-2 justify-end">
                                <LocalModelProivderContentSheet data={item} />
                                <Button
                                    className="h-7 px-2 cursor-pointer"
                                    onClick={() => openModelConfigModal(item)}
                                >
                                    <span className="text-xs">配置</span>
                                    <Icon icon="line-md:menu-unfold-right" size={18} />
                                </Button>
                            </div>
                        </div>
                    </CardTitle>
                    <CardDescription className="flex space-x-2.5">
                        <Badge variant="secondary">
                            <span className="font-medium select-none">可用模型：{item.models.length} 个</span>
                        </Badge>
                        {!item.key ?
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