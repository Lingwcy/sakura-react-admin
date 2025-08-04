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
import FileUpload from "../ui/file-upload"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { toast } from "sonner"
import { useState } from "react"
interface CreateUserDialogProps {
    open?: boolean
    onClose?: () => void
}

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "用户名最短需要2个字符",
    }),
    email: z.email({
        message: "请输入有效的邮箱地址",
    }),
    avatar: z.string().optional(),
    password: z.string()
        .min(6, { message: "密码最短需要6个字符" })
        .max(20, { message: "密码最长不能超过20个字符" }),
});
export default function CreateUserDialog({ open, onClose }: CreateUserDialogProps) {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            avatar: "",
            password: ""
        }
    })
    const [avatarFileUploadSwith, setAvatarFileUploadSwith] = useState<boolean>(false)

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        // 动态验证头像字段
        const avatarValidation = avatarFileUploadSwith 
            ? z.string().min(1, { message: "请上传头像文件" })
            : z.string().url({ message: "请输入有效的URL链接" });
        
        const dynamicSchema = FormSchema.extend({
            avatar: avatarValidation
        });

        const result = dynamicSchema.safeParse(data);
        if (!result.success) {
            toast("表单提交失败，请检查字段！");
        } else {
            toast("表单提交成功");
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>新增用户</DialogTitle>
                    <DialogDescription>
                        填写用户信息，点击保存完成创建。
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
                                    <FormLabel>密码</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入密码" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
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
                    <Button type="submit" form="create-user-form">保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}