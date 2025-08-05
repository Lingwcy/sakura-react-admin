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
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FileUpload from "@/components/ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { UserItem } from "@/types/userType"
import { useUserList } from "@/hooks/use-user"
interface UserDialogProps {
    open: boolean
    enableSelected: boolean
    onClose: () => void
    updateUserItem?: UserItem
}

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "用户名最短需要2个字符",
    }),
    email: z.email({
        message: "请输入有效的邮箱地址",
    }),
    avatar: z.string(),
    password: z.string()
        .min(6, { message: "密码最短需要6个字符" })
        .max(20, { message: "密码最长不能超过20个字符" }),
});
export default function UserDialog({ open, onClose, updateUserItem }: UserDialogProps) {
    const {updateUser, createUser} = useUserList()
    const isUpdateMode = !!updateUserItem

    // 根据模式动态创建表单验证规则
    // 主要调整 更新模式下 密码的修改是可选的。
    const getFormSchema = () => {
        if (isUpdateMode) {
            return FormSchema.extend({
                password: z.string().optional().or(z.string().min(6, { message: "密码最短需要6个字符" }).max(20, { message: "密码最长不能超过20个字符" }))
            });
        }
        return FormSchema;
    };

    const form = useForm({
        resolver: zodResolver(getFormSchema()),
        defaultValues: {
            name: "",
            email: "",
            avatar: "",
            password: ""
        }
    })

    useEffect(() => {
        if (updateUserItem) {
            form.reset({
                name: updateUserItem.name || "",
                email: updateUserItem.email || "",
                avatar: updateUserItem.avatar || "",
                password: ""
            })
        } else {
            // 重置为创建模式的默认值
            form.reset({
                name: "",
                email: "",
                avatar: "",
                password: ""
            })
        }
    }, [updateUserItem, form])
    const [avatarFileUploadSwith, setAvatarFileUploadSwith] = useState<boolean>(false)

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const avatarValidation = avatarFileUploadSwith
            ? z.string().min(1, { message: "请上传头像文件" })
            : z.string().url({ message: "请输入有效的URL链接" });

        const baseSchema = getFormSchema();
        const dynamicSchema = baseSchema.extend({
            avatar: avatarValidation
        });

        const result = dynamicSchema.safeParse(data);
        if (!result.success) {
            toast.error("表单提交失败，请检查字段！");
            console.log("验证错误:", result.error.issues);
        } else {
            if (isUpdateMode) {
                // 在更新模式下，如果密码为空则不包含在更新数据中
                const updateData = { ...data, id: updateUserItem?.id };
                if (!data.password || data.password.trim() === "") {
                    delete updateData.password;
                }
                updateUser.mutate({ id: updateData.id, user: updateData })
            } else {
                createUser.mutate(data)
            }
            onClose?.(); // 成功后关闭对话框
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdateMode ? "编辑用户" : "新增用户"}</DialogTitle>
                    <DialogDescription>
                        {isUpdateMode ? "修改用户信息，点击保存完成更新。" : "填写用户信息，点击保存完成创建。"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>用户名</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入用户名" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>邮箱</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入邮箱" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex justify-between" >
                                        <span>{avatarFileUploadSwith ? "头像(文件上传)" : "头像(URL上传)"}</span> <Switch checked={avatarFileUploadSwith} onCheckedChange={setAvatarFileUploadSwith} />
                                    </FormLabel>
                                    <FormControl>
                                        {avatarFileUploadSwith ?
                                            <FileUpload />
                                            : <Input placeholder="请输入头像URL" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {isUpdateMode ? "密码（留空则不修改）" : "密码"}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={isUpdateMode ? "留空则不修改密码" : "请输入密码"}
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
                    <Button type="submit" form="create-user-form">
                        {isUpdateMode ? "更新" : "保存"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}