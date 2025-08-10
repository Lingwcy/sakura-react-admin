
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUserToken, useUserProfile } from '@/hooks/use-user'
import { useNavigate } from 'react-router'
import { Button } from "@/components/ui/button"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "账户最小需要2个字符.",
    }),
    password: z.string().
        min(6, { message: "密码需要大于6位数" }).
        max(20, { message: "密码需要小于20位数" })
})


export default function LoginForm() {
    const { sinIn } = useUserToken()
    const { getUserInfo } = useUserProfile()
    const navigate = useNavigate()
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const result = FormSchema.safeParse(data)
        if (!result.success) {
            console.error(result.error);
        } else {
            try {
                await sinIn(result.data)
                await getUserInfo()
                navigate('/')
                //bug navigate('/')不会主动跳转，只能刷新页面 才会触发重定向
                window.location.reload()
            } catch (error) {
                console.error('登录或获取用户信息失败:', error)
            }
        }
    }

    return (
        <div className='w-72 h-auto border-0 flex justify-center flex-col mx-auto'>
            <div className="flex flex-col items-center p-4 space-y-1">
                <p className="font-extrabold tracking-tight text-2xl">
                    登录到您的账户
                </p>
                <p className="text-muted-foreground text-sm">
                    输入您的账号登录到您的账户
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>账户</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ou_Takahiro" className="placeholder:text-sm focus-visible:ring-pink-200" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>密码</FormLabel>
                                <FormControl>
                                    <Input className="placeholder:text-sm focus-visible:ring-pink-200" placeholder="密码" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row justify-between pt-2 pb-2">
                        <div className="flex space-x-1">
                            <Checkbox className="data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400" id="terms" />
                            <span></span>
                            <Label className="text-xs text-pink-600" htmlFor="terms">记住我</Label>
                        </div>

                        <Label className="text-xs text-pink-600 cursor-pointer">忘记密码?</Label>
                    </div>
                    <Button type="submit" variant="secondary" className="w-full bg-pink-400">
                        <Label className="text-sm text-pink-100">登录</Label>
                    </Button>
                </form>
            </Form>

        </div>
    )
}