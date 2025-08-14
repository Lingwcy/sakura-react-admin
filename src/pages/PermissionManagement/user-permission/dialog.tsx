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
import { useEffect, useState } from "react"
import { Permission } from "@/types/roleType"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { SelectParentsBox } from "./components/select-parent-box"
import { useRootPermissionList } from "@/hooks/use-permission"
import { PageAutocomplete } from "./components/auto-complete-box"
import { useNextRootId, useNextChildId } from "@/hooks/use-permission"


interface PermissionDialogProps {
    open: boolean
    enableSelected: boolean
    onClose: () => void
    updateItem?: Permission
    handleCreate: (node: Omit<Permission, 'children'>) => void
    handleEdit: (npde: Permission) => void
}

const FormSchema = z.object({
    id: z.string().min(2, {
        message: "ID最短需要2个字符",
    }),
    parentId: z.string().min(2, {
        message: "父亲ID最短需要2个字符",
    }),
    name: z.string().min(2, {
        message: "用户名最短需要2个字符",
    }),
    label: z.string().min(2, {
        message: "标签最短需要2个字符",
    }),
    type: z.number().min(0).max(1),
    route: z.string().min(2, {
        message: "标签最短需要2个字符",
    }),
    status: z.number().min(0).max(1),
    order: z.number().int(),
    icon: z.string().min(2, {
        message: "标签最短需要2个字符",
    }),
    component: z.string().min(2, {
        message: "标签最短需要2个字符",
    }),
    hide: z.number().min(0).max(1),
});
export default function PermissionDialog({ open, onClose, updateItem, handleCreate, handleEdit }: PermissionDialogProps) {
    const isUpdateMode = !!updateItem
    // 菜单0  视图1
    const [nodeType, setNodeType] = useState<string>("0")
    const [nodeStatus, setNodeStatus] = useState<string>("1")

    const { data: nextRootId , isLoading: isNextRootIdLoading } = useNextRootId()
    const { data: nextChildId, isLoading: isNextChildIdLoading ,setParentId } = useNextChildId()
    const rootPermissionList = useRootPermissionList()

    // 根据模式动态创建表单验证规则
    const getFormSchema = () => {
        return FormSchema;
    };

    const form = useForm({
        resolver: zodResolver(getFormSchema()),
        defaultValues: {
            id: "",
            parentId: "",
            name: "",
            label: "",
            type: 0,
            route: "",
            status: 1,
            order: 0,
            icon: "",
            component: "",
            hide: 0,
        }
    })

    useEffect(() => {
        if (updateItem) {
            form.reset({
                id: updateItem.id || "",
                parentId: updateItem.parentId || "",
                name: updateItem.name || "",
                label: updateItem.label || "",
                type: updateItem.type || 0,
                route: updateItem.route || "",
                status: updateItem.status || 1,
                order: updateItem.order || 0,
                icon: updateItem.icon || "",
                component: updateItem.component || "",
                hide: updateItem.hide ? 1 : 0,
            })
            setNodeType(String(updateItem.type || 0))
            setNodeStatus(String(updateItem.status || 1))
        } else {
            // 重置为创建模式的默认值
            form.reset({
                id: "",
                parentId: "",
                name: "",
                label: "",
                type: 0,
                route: "",
                status: 1,
                order: 0,
                icon: "",
                component: "",
                hide: 0,
            })
            setNodeType("0")
            setNodeStatus("1")
        }
    }, [updateItem, form])

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        console.log(data)
        const baseSchema = getFormSchema();
        const dynamicSchema = baseSchema.extend({
        });

        const result = dynamicSchema.safeParse(data);
        if (!result.success) {
            toast.error("表单提交失败，请检查字段！");
            console.log("验证错误:", result.error.issues);
        } else {
            if (isUpdateMode) {
                console.log('update permission')
            } else {
                console.log('create permission')
            }
            onClose?.(); // 成功后关闭对话框
        }
    }

    
    const handleGetNextId = () => {
        if (Number(nodeType) === 0) {
            if (!isNextRootIdLoading && nextRootId) {
                form.setValue("id", nextRootId.data.id)
            }
        }else{
            if(!form.getValues().parentId){
                toast.error("在视图模式下，请先选择父节点！")
                return
            }
            setParentId(form.getValues().parentId)
            if (!isNextChildIdLoading && nextChildId) {
                form.setValue("id", nextChildId.data.id)
            }
        }
            
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-pink-800">{isUpdateMode ? "编辑权限节点" : "新增权限节点"}</DialogTitle>
                    <DialogDescription className="text-pink-500">
                        {isUpdateMode ? "编辑现有的权限节点" : "构建新权限节点的相关信息"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-pink-900">节点类型</FormLabel>
                                        <FormControl>
                                            <ToggleGroup
                                                variant="outline"
                                                type="single"
                                                value={nodeType}
                                                onValueChange={(value) => {
                                                    setNodeType(value)
                                                    field.onChange(Number(value))
                                                    form.reset({
                                                        ...form.getValues(),
                                                        parentId: "",
                                                        component: "",
                                                    })
                                                }}
                                            >
                                                <ToggleGroupItem value="0">
                                                    <p className="italic text-xs ">菜单</p>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="1">
                                                    <p className="italic text-xs ">视图</p>
                                                </ToggleGroupItem>
                                            </ToggleGroup>
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
                                        <FormLabel className="text-pink-900">状态</FormLabel>
                                        <FormControl>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {Number(nodeType) === 1 && (
                                <FormField
                                    control={form.control}
                                    name="parentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-pink-900">父节点</FormLabel>
                                            <FormControl>
                                                <SelectParentsBox
                                                    list={rootPermissionList.data.data}
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value)
                                                        setParentId(value)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}>
                                </FormField>
                            )}
                            {Number(nodeType) === 1 && (
                                <FormField
                                    control={form.control}
                                    name="component"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-pink-900">组件</FormLabel>
                                            <FormControl>
                                                <PageAutocomplete
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}>
                                </FormField>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-pink-900">ID</FormLabel>
                                    <FormControl>
                                        <div className="flex">
                                            <Input
                                                placeholder="输入唯一id"
                                                className="rounded-r-none focus-visible:ring-0"
                                                {...field}
                                            />
                                            <Button type="button" className="rounded-l-none w-fit p-1 bg-pink-600  hover:bg-pink-800" size="icon"
                                                onClick={handleGetNextId}>
                                                <span className="italic font-bold text-xs">
                                                    获取
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-pink-900">渲染标签</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={'用于浏览器显示'}
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
                                        <FormLabel className="text-pink-900">名称</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={'输入权限点名称'}
                                                className="placeholder:text-sm focus-visible:ring-pink-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="route"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-pink-900">路由切片</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={'输入此节点挂载的路由片段'}
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
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-pink-900">图标</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder={'iconfiy 图标name'}
                                                className="placeholder:text-sm focus-visible:ring-pink-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>

                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-pink-900">顺序</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder={'排序顺序'}
                                            className="placeholder:text-sm focus-visible:ring-pink-200"
                                            {...field}
                                        />
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
                    <Button className=" bg-pink-600  hover:bg-pink-800" type="submit" form="create-user-form">
                        {isUpdateMode ? "更新" : "保存"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}