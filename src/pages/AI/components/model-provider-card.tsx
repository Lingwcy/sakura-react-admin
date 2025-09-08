import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelProviderItem } from "@/types/ai";
import { Button } from "../../../components/ui/button";
import Icon from "../../../components/ui/icon";
import { Separator } from "../../../components/ui/separator";
import Text2ImageMapper from "./text2image-mapper";
interface ModelProviderCardProps {
    data: ModelProviderItem
    status?: 'cloud' | 'local'
    onEdit?: (m: ModelProviderItem) => void
    onDelete?: (m: ModelProviderItem) => void
    onAddToLocal?: (m: ModelProviderItem) => void
    isAdded?: boolean // 新增
}

export default function ModelProviderCard({
    data,
    status = 'cloud',
    onEdit,
    onDelete,
    onAddToLocal,
    isAdded = false
}: ModelProviderCardProps) {
    return (
        <Card className="w-l">
            <CardHeader>
                <CardTitle className="truncate">
                    <div className="text-l flex justify-between items-center space-x-2 ">
                        <span className="truncate">{data?.name || '未知模型'}</span>
                        {
                            status == 'cloud' ?
                                <Button
                                    className="h-8 text-xs rounded-md cursor-pointer"
                                    disabled={isAdded}
                                    onClick={() => !isAdded && onAddToLocal?.(data)}
                                    variant={isAdded ? "secondary" : "default"}
                                >
                                    {isAdded ? (
                                        <span className="flex items-center gap-1">
                                            <Icon icon="line-md:confirm" size={16} />
                                            已添加
                                        </span>
                                    ) : (
                                        <>
                                            添加常用
                                            <Icon icon="line-md:navigation-right-up" size={18} />
                                        </>
                                    )}
                                </Button> :
                                <div className="space-x-1.5 flex">
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 text-xs rounded-md cursor-pointer"
                                        onClick={() => onEdit?.(data)}
                                    >
                                        <Icon icon="line-md:edit" color="#2f8dd9" size={18} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 text-xs rounded-md cursor-pointer"
                                        onClick={() => onDelete?.(data)}
                                    >
                                        <Icon icon="line-md:remove" color="red" size={18} />
                                    </Button>
                                </div>
                        }
                    </div>
                </CardTitle>
                <CardDescription>
                    <div className="flex flex-row gap-2">
                        <Badge variant="secondary">
                            <div className="flex items-center gap-1">
                                {data.architecture.input_modalities?.map((modality, index) => (
                                    <Text2ImageMapper key={index} data={modality} size={16} />
                                )) || <span>未知</span>}
                                <Icon icon="humbleicons:arrow-join" size={14} />
                                {data.architecture.output_modalities?.map((modality, index) => (
                                    <Text2ImageMapper key={index} data={modality} size={16} />
                                )) || <span>未知</span>}
                            </div>
                        </Badge>
                        <Badge variant="secondary">
                            <Icon icon={data?.top_provider?.is_moderated ? 'ix:surveillance-filled' : 'ix:surveillance-cancelled-filled'} size={16} />
                            <span>{data?.top_provider?.is_moderated ? '审核' : '不审核'}</span>
                        </Badge>
                        {
                            data.name.includes('free') && <Badge variant="secondary">
                                <Icon icon="material-symbols:public" size={16} ></Icon>
                                免费
                            </Badge>
                        }
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex gap-5">
                <div>
                    <h4 className="font-bold mb-1 text-xs">容量(tokens)</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p className="text-foreground text-[11px]">上下文: {data?.context_length?.toLocaleString() || '未知'}</p>
                        <p className="text-foreground text-[11px]">最大输出: {data?.top_provider?.max_completion_tokens?.toLocaleString() || '未知'}</p>
                    </div>
                </div>
                <Separator orientation="vertical" />


                <div>
                    <h4 className="font-bold mb-1 text-xs">计费 ($/1M tokens)</h4>
                    {
                        data.pricing ?
                            <div className="text-xs text-gray-600 space-y-1">
                                <p className="text-foreground text-[11px]">输入: ${((parseFloat(data.pricing.prompt) || 0) * 1000000).toFixed(2)}</p>
                                <p className="text-foreground text-[11px]">输出: ${((parseFloat(data.pricing.completion) || 0) * 1000000).toFixed(2)}</p>
                            </div> :
                            <div className="text-xs text-gray-600 space-y-1">
                                <p className="text-foreground text-[11px]">输入: 未知</p>
                                <p className="text-foreground text-[11px]">输出: 未知</p>
                            </div>
                    }
                </div>

            </CardContent>
            {
                status == 'cloud' &&
                <CardFooter className="text-xs text-gray-400 m-0 space-x-2.5 cursor-pointer">
                    <div className="truncate">ID: {data?.id || '未知'}</div>
                    <Icon icon="ion:copy" size={14} />
                </CardFooter>
            }
        </Card>
    )
}