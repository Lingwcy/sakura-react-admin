import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ModelProvider } from "@/types/ai"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ModelProviderCard from "./model-provider-card"
import { useModelProviderItem } from "@/hooks/use-model-provider"
import ModelProviderItemModal from "./model-provider-item-modal"

interface LocalModelProivderContentSheetProps {
    data: ModelProvider
}

export default function LocalModelProivderContentSheet(
    { data }: LocalModelProivderContentSheetProps
) {
    const {
        models,
        handleCreateModel,
        handleUpdateModel,
        handleDeleteModel,
        isCreating,
        isUpdating,
        isDeleting
    } = useModelProviderItem(data.id)

    const [modalOpen, setModalOpen] = useState(false)
    const [editingModel, setEditingModel] = useState<any>()

    const openCreate = () => {
        setEditingModel(undefined)
        setModalOpen(true)
    }
    const openEdit = (m: any) => {
        setEditingModel(m)
        setModalOpen(true)
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button className="cursor-pointer w-18 h-7">
                    <span className="text-xs">
                        模型
                    </span>
                    <Icon icon="carbon:model-alt" size={18} />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px]">
                <SheetHeader className="m-0 space-y-1">
                    <SheetTitle>
                        <span className="text-xl">
                            {data.name}
                        </span>
                    </SheetTitle>
                    <SheetDescription>
                        {
                            models.length !== 0 &&
                            <Button className="w-18 h-7 cursor-pointer" onClick={openCreate}>
                                <span className=" font-light text-xs">添加模型</span>
                            </Button>
                        }
                    </SheetDescription>
                </SheetHeader>

                {
                    models.length === 0 &&
                    <div className="flex flex-col space-y-1.5 justify-center items-center">
                        <p className="font-bold text-xl">没有内容</p>
                        <p className="font-light text-[13px]">还没有任何模型，快添加一个吧！</p>
                        <Button className="w-[80%] h-7 cursor-pointer" onClick={openCreate}>
                            <span className=" font-light text-xs">添加模型</span>
                        </Button>
                    </div>
                }
                {/* 模型列表 */}
                <ScrollArea className="h-[calc(100vh-100px)]">
                    <div className="flex flex-col justify-center items-center gap-4 ">
                        {
                            // 渲染本地模型 ModelProviderCard
                            // status="local" 启用编辑与删除按钮（由 ModelProviderCard 内部根据 status 控制）
                            models.map(item => {
                                return (
                                    <ModelProviderCard
                                        key={item.id}
                                        data={item}
                                        status="local"
                                        onEdit={() => openEdit(item)}
                                        onDelete={async () => {
                                            await handleDeleteModel(item.id)
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </SheetContent>
            <ModelProviderItemModal
                open={modalOpen}
                providerId={data.id}
                editItem={editingModel}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreateModel}
                onUpdate={handleUpdateModel}
                onDelete={async (id) => { await handleDeleteModel(id) }}
                isSubmitting={isCreating || isUpdating || isDeleting}
            />
        </Sheet>
    )
}