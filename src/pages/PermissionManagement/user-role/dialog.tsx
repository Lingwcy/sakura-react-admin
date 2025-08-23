import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useEffect } from "react"
import { Role } from "@/types/roleType"
import { PermisionTree2List } from "@/utils/permission"
import TestPermissionSelectTree from "@/pages/Component/permissiom-select-tree"
interface RoleDialogProps {
    open: boolean
    enableSelected: boolean
    onClose: () => void
    updateItem?: Role
    handleCreate: (role: Omit<Role, 'id'>) => void
    handleEdit: (role: Omit<Role, 'permission'> & { permissionIds: string[] }) => void
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
    id: z.string(),
    permissionIds: z.array(z.string()).optional(),
    desc: z.string().optional()
});

export default function RoleDialog({ open, onClose, updateItem, handleCreate, handleEdit }: RoleDialogProps) {
    const isUpdateMode = !!updateItem
    const [checked, setChecked] = useState([])
    const [nodeStatus, setNodeStatus] = useState<string>("1")

    // 如果是更新模式，往checked 中注入权限节点
    useEffect(() => {
        if (isUpdateMode) {
            const list = PermisionTree2List(updateItem.permission)
            const res = list.map(item => item.id)
            setChecked(res)
        }
        return () => {
            setChecked([])
        }
    }, [isUpdateMode, updateItem])

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
            id: "",
            name: "",
            label: "",
            status: 0,
            order: 0,
            permissionIds: []
        }
    })

    useEffect(() => {
        if (updateItem) {
            form.reset({
                id: updateItem.id,
                name: updateItem.name,
                label: updateItem.label,
                status: updateItem.status,
                order: updateItem.order,
                desc: updateItem.desc
            })
        } else {
            // 重置为创建模式的默认值
            form.reset({
                id: "",
                name: "",
                label: "",
                status: 0,
                order: 0,
                permissionIds: [],
                desc: ''
            })
        }
    }, [updateItem, form])

    // 监听对话框关闭状态，确保关闭时清理表单
    useEffect(() => {
        if (!open) {
            form.reset({
                id: "",
                name: "",
                label: "",
                status: 0,
                order: 0,
                permissionIds: [],
                desc: ''
            })
            setChecked([])
            setNodeStatus("1")
        }
    }, [open, form])

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const baseSchema = getFormSchema();

        // 添加当前选中的权限ID到表单数据
        const formDataWithPermissions = {
            ...data,
            permissionIds: checked
        };

        const result = baseSchema.safeParse(formDataWithPermissions);
        if (!result.success) {
            toast.error("表单提交失败，请检查字段！");
            console.log("验证错误:", result.error.issues);
        } else {
            if (isUpdateMode) {
                handleEdit(formDataWithPermissions)
            } else {
                handleCreate(formDataWithPermissions)
            }
            onClose?.(); // 成功后关闭对话框
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] ">
                <DialogHeader>
                    <DialogTitle>{isUpdateMode ? "编辑角色" : "新增角色"}</DialogTitle>
                    <DialogDescription>
                        {isUpdateMode ? "修改角色信息，点击保存完成更新。" : "填写角色信息，点击保存完成创建。"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-5">
                    <Form {...form}>
                        <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <ToggleGroup
                                            variant="outline"
                                            type="single"
                                            value={nodeStatus}
                                            onValueChange={(value) => {
                                                setNodeStatus(value)
                                                field.onChange(Number(value))
                                            }}
                                        >
                                            <ToggleGroupItem value="1">
                                                <p className="italic text-xs ">开启</p>
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="0">
                                                <p className="italic text-xs ">禁用</p>
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormItem>
                                )}>
                            </FormField>
                            {isUpdateMode && <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder={field.value} className="placeholder:text-sm focus-visible:ring-pink-200" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>}
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
                                            <Input
                                                type="number"
                                                placeholder="输入顺序"
                                                className="placeholder:text-sm focus-visible:ring-pink-200"
                                                {...field}
                                                onChange={(e) => field.onChange(+e.target.value)} //为什么我这里type number了还是报错，必须手动用 + 强转？
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                            <FormField
                                control={form.control}
                                name="desc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>描述</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="角色描述"
                                                className="placeholder:text-sm focus-visible:ring-pink-200"
                                                {...field} />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                        </form>
                    </Form>
                    <TestPermissionSelectTree checked={checked} setChecked={setChecked} />
                </div>
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