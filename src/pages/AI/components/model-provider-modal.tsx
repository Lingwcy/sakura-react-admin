import { ModelProvider } from "@/types/ai"
import { Button } from "@/components/ui/button"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { toast } from "sonner"
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
    handleEdit?: (item: ModelProvider) => void
}
export default function ModelProviderModal({
    open,
    updateItem,
    onClose,
    handleCreate,
    handleEdit
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
        env: z.string().optional()
    })

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            name: "",
            url: "",
            env: ""
        }
    })

    const onSubmit = (data: z.infer<typeof FormSchema>) => {

        const baseSchema = FormSchema;

        const result = baseSchema.safeParse(data);
        if (!result.success) {
            toast.error("表单提交失败，请检查字段！");
            console.log("验证错误:", result.error.issues);
        } else {
            if (isUpdateMode) {
                // handleEdit(updateData)
                
            } else {
                // handleCreate(data)
            }
            onClose?.(); // 成功后关闭对话框
        }
    }

    useEffect(() => {
        if (updateItem) {
            form.reset({
                id: updateItem.id || "",
                name: updateItem.name || "",
                url: updateItem.url || "",
                env: updateItem.variable || ""
            })
        } else {
            form.reset({
                id: "",
                name: "",
                url: "",
                env: ""
            })
        }
    }, [updateItem, form])




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
                                        <Input placeholder="E.g.,my-provider" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
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
                            name="env"
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
                        <Button variant="outline" onClick={onClose}>
                            取消
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="create-user-form">
                        {isUpdateMode ? "更新" : "保存"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}