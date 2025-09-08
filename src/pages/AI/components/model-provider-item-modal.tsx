import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ModelProviderItem } from "@/types/ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface ModelProviderItemModalProps {
    open: boolean
    providerId: string
    editItem?: ModelProviderItem
    onClose: () => void
    onCreate: (model: ModelProviderItem) => Promise<void>
    onUpdate: (id: string, model: Partial<ModelProviderItem>) => Promise<void>
    onDelete: (id: string) => Promise<void>
    isSubmitting?: boolean
}

const schema = z.object({
    id: z.string().min(2, { message: "至少 2 个字符" }),
    name: z.string().min(2, { message: "至少 2 个字符" }),
    context_length: z.number().int().positive({ message: "必须为正整数" }),
    max_completion_tokens: z.number().int().positive({ message: "必须为正整数" }).optional(),
})

export default function ModelProviderItemModal({
    open,
    providerId,
    editItem,
    onClose,
    onCreate,
    onUpdate,
    onDelete,
    isSubmitting = false
}: ModelProviderItemModalProps) {

    const isEdit = !!editItem

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: "",
            name: "",
            context_length: 8192,
            max_completion_tokens: 4096,
        }
    })

    useEffect(() => {
        if (isEdit && editItem) {
            form.reset({
                id: editItem.id || "",
                name: editItem.name || "",
                context_length: editItem.context_length || editItem.top_provider?.context_length || 8192,
                max_completion_tokens: editItem.top_provider?.max_completion_tokens || 4096,
            })
        } else {
            form.reset({
                id: "",
                name: "",
                context_length: 8192,
                max_completion_tokens: 4096,
            })
        }
    }, [isEdit, editItem, form])

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const payloadTopProvider = {
            context_length: values.context_length,
            max_completion_tokens: values.max_completion_tokens ?? null,
            is_moderated: editItem?.top_provider?.is_moderated ?? false
        }

        if (isEdit) {
            await onUpdate(editItem!.id, {
                name: values.name,
                context_length: values.context_length,
                top_provider: payloadTopProvider
            })
        } else {
            await onCreate({
                id: values.id,
                name: values.name,
                context_length: values.context_length,
                architecture: {
                    input_modalities: ["text"],
                    output_modalities: ["text"],
                    tokenizer: "",
                    instruct_type: null
                },
                supported_parameters: [],
                per_request_limits: null,
                top_provider: payloadTopProvider
            } as ModelProviderItem)
        }
        onClose()
    }

    const handleDelete = async () => {
        if (!isEdit) return
        await onDelete(editItem!.id)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "编辑模型" : "新增模型"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? `编辑模型 (Provider: ${providerId})` : `为提供商 ${providerId} 新增模型`}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="model-item-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>模型ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="unique-model-id" disabled={isEdit} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>名称</FormLabel>
                                    <FormControl>
                                        <Input placeholder="模型名称" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="context_length"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>上下文窗口</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min={1} 
                                                placeholder="8192" 
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="max_completion_tokens"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>最大输出 Tokens</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min={1} 
                                                placeholder="4096" 
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                    </form>
                </Form>
                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isSubmitting}>取消</Button>
                        </DialogClose>
                        {isEdit && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="cursor-pointer"
                            >
                                删除
                            </Button>
                        )}
                    </div>
                    <Button
                        type="submit"
                        form="model-item-form"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "处理中..." : (isEdit ? "保存修改" : "创建")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}