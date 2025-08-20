

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useEffect} from "react"
import { Role } from "@/types/roleType"
interface RoleDialogProps {
    open: boolean
    enableSelected: boolean
    onClose: () => void
    updateItem?: Role
    handleCreate: (role: Role) => void
    handleEdit: (role: Role) => void
}

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "用户名最短需要2个字符",
    }),
    label: z.string().min(2, {
        message: "用户名最短需要2个字符",
    }),
    status: z.number().min(0).max(1),
    order: z.number(),
});
export default function RoleDialog({ open, onClose, updateItem, handleCreate, handleEdit }: RoleDialogProps) {
    const isUpdateMode = !!updateItem

    // 根据模式动态创建表单验证规则
    // 主要调整 更新模式下 密码的修改是可选的。
    const getFormSchema = () => {
        if (isUpdateMode) {
            return FormSchema.extend({

            });
        }
        return FormSchema;
    };

    const form = useForm({
        resolver: zodResolver(getFormSchema()),
        defaultValues: {
            name: "",
            label: "",
            status: 0,
            order: 0

        }
    })

    useEffect(() => {

        if (updateItem) {
            form.reset({
                name: updateItem.name,
                label: updateItem.label,
                status: updateItem.status,
                order: updateItem.order
            })
        } else {
            // 重置为创建模式的默认值
            form.reset({
                name: "",
                label: "",
                status: 0,
                order: 0
            })
        }
    }, [updateItem, form])

    const onSubmit = (data: z.infer<typeof FormSchema>) => {

        const baseSchema = getFormSchema();

        const result = baseSchema.safeParse(data);
        if (!result.success) {
            toast.error("表单提交失败，请检查字段！");
            console.log("验证错误:", result.error.issues);
        } else {
            if (isUpdateMode) {
                console.log(data)
                handleEdit(data)

            } else {
                handleCreate(data)
                console.log(data)
            }
            onClose?.(); // 成功后关闭对话框
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdateMode ? "编辑角色" : "新增角色"}</DialogTitle>
                    <DialogDescription>
                        {isUpdateMode ? "修改角色信息，点击保存完成更新。" : "填写角色信息，点击保存完成创建。"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>名称</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入名称" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>标签</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入标签" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>顺序</FormLabel>
                                    <FormControl>
                                        <Input placeholder="输入顺序" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>状态</FormLabel>
                                    <FormControl>
                                        <Input placeholder="输入顺序" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
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