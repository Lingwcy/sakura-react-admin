import { ModelProvider } from "@/types/ai"
import { Button } from "@/components/ui/button"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ModelProviderModalProps {
    open: boolean,
    updateItem?: ModelProvider
    onClose: () => void
    handleCreate?: (item: ModelProvider) => void
    handleEdit?: (id: string, item: Partial<ModelProvider>) => void
    handleDelete: (id: string) => void
    nextId?: string
    isSubmitting?: boolean
}

export default function ModelProviderModal({
    open,
    updateItem,
    onClose,
    handleCreate,
    handleEdit,
    handleDelete,
    nextId,
    isSubmitting = false
}: ModelProviderModalProps) {
    const isUpdateMode = !!updateItem

    const FormSchema = z.object({
        id: z.string().min(2, {
            message: '最少需要两个字符'
        }),
        name: z.string().min(2, {
            message: '最少需要两个字符'
        }),
        url: z.url({ message: '必须是合法的url格式' }),
        key: z.string({ message: '你必须提供该模型供应商的合法key' }),
        variable: z.string().optional()
    })

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            name: "",
            url: "",
            variable: "",
            key: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            if (isUpdateMode && updateItem && handleEdit) {
                await handleEdit(updateItem.id!, {
                    name: data.name,
                    url: data.url,
                    key: data.key,
                    variable: data.variable
                })
            } else if (handleCreate) {
                await handleCreate({
                    id: data.id,
                    name: data.name,
                    key: data.key,
                    url: data.url,
                    variable: data.variable
                } as ModelProvider)
            }
            onClose?.()
        } catch (error) {
            console.error('提交失败:', error)
        }
    }

    useEffect(() => {
        if (updateItem) {
            form.reset({
                id: updateItem.id || "",
                name: updateItem.name || "",
                url: updateItem.url || "",
                key: updateItem.key || "",
                variable: updateItem.variable || ""
            })
        } else {
            form.reset({
                id: nextId || "",
                name: "",
                url: "",
                key: "",
                variable: ""
            })
        }
    }, [updateItem, form, nextId])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdateMode ? "配置AI提供商信息" : "新增AI提供商"}</DialogTitle>
                    <DialogDescription>
                        {isUpdateMode ? "配置AI提供商信息, 点击保存完成修改。" : "新增AI提供商, 点击保存完成修改。"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>供应商ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="E.g.,my-provider"
                                            className="placeholder:text-sm focus-visible:ring-pink-200"
                                            disabled={isUpdateMode}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>KEY</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            className="placeholder:text-sm focus-visible:ring-pink-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>供应商名称</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g.,DeepSeek" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>API 地址</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g.,https://api.mymodel.com/v1" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="variable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>环境变量(可选)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g.,MY_ENV_VAR" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                            取消
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" className="cursor-pointer" onClick={() => {
                        handleDelete(updateItem.id)
                        onClose()
                    }}>
                        删除
                    </Button>
                    <Button type="submit" form="create-user-form" disabled={isSubmitting}>
                        {isSubmitting ? "处理中..." : (isUpdateMode ? "更新" : "保存")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}