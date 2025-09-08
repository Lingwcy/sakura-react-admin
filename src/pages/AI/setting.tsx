import Icon from "@/components/ui/icon";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { ModelProvider } from "@/types/ai";
import ModelProviderBrandCard from "./components/model-provider-brand-card";
import clsx from "clsx";
import { useModelProviderModal, useModelProvider } from "@/hooks/use-model-provider";
import ModelProviderModal from "./components/model-provider-modal";
import { Skeleton } from "@/components/ui/skeleton";

export default function AISettingPage() {
    const {
        editItem,
        open,
        handleCloseModal,
        handleOpenModal,
    } = useModelProviderModal()
    
    const {
        providers,
        isLoading,
        isCreating,
        isUpdating,
        nextId,
        handleCreate,
        handleUpdate,
        handleDelete,
        error
    } = useModelProvider()

    const handleAddProvider = () => {
        handleOpenModal()
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-500">
                加载失败: {error.message}
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-row flex-wrap justify-center">
                <ModelProviderBrandContent>
                    {isLoading ? (
                        // 加载骨架屏
                        Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index} className="border">
                                <CardContent className="flex justify-center items-center space-y-2.5 flex-col p-6">
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-4 w-24" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <>
                            {providers.map((provider) => (
                                <ModelProviderBrandCard 
                                    openModelConfigModal={handleOpenModal} 
                                    key={provider.id} 
                                    item={provider} 
                                />
                            ))}
                            <Card 
                                className="border-dashed border-2 cursor-pointer hover:bg-secondary transition-all duration-200"
                                onClick={handleAddProvider}
                            >
                                <CardContent className="flex justify-center items-center space-y-2.5 flex-col">
                                    <Icon icon="line-md:plus" size={32} />
                                    <p className="font-bold text-md">添加自定义提供商</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </ModelProviderBrandContent>
            </div>            
           
            <ModelProviderModal 
                open={open} 
                onClose={handleCloseModal} 
                updateItem={editItem}
                handleCreate={handleCreate}
                handleEdit={handleUpdate}
                handleDelete={handleDelete}
                nextId={nextId}
                isSubmitting={isCreating || isUpdating}
            />
        </>
    )
}



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


