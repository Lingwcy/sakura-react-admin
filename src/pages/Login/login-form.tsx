import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useManagerLogin } from "@/hooks/use-manager";
import { getRequestErrorMessage } from "@/utils/request";

const LoginSchema = z.object({
	email: z.email({ message: "请输入有效的管理员邮箱" }),
	password: z.string().min(1, { message: "请输入密码" }),
});

type LoginValues = z.infer<typeof LoginSchema>;
type LoginLocationState = { from?: { pathname?: string } };

export default function LoginForm() {
	const navigate = useNavigate();
	const location = useLocation();
	const login = useManagerLogin();
	const form = useForm<LoginValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: "", password: "" },
	});

	async function onSubmit(values: LoginValues) {
		try {
			await login.mutateAsync(values);
			const state = location.state as LoginLocationState | null;
			navigate(state?.from?.pathname || "/home", { replace: true });
		} catch (error) {
			toast.error(getRequestErrorMessage(error, "登录失败，请检查账号和密码"));
		}
	}

	return (
		<div className="mx-auto flex h-auto w-72 flex-col justify-center">
			<div className="flex flex-col items-center space-y-1 p-4">
				<p className="text-2xl font-extrabold tracking-tight">管理员登录</p>
				<p className="text-sm text-muted-foreground">使用漫画平台已注册的管理员邮箱登录</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>邮箱</FormLabel>
								<FormControl>
									<Input type="email" autoComplete="username" placeholder="admin@example.com" {...field} />
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
									<Input type="password" autoComplete="current-password" placeholder="请输入密码" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant="secondary" className="w-full bg-pink-400 text-white" disabled={login.isPending}>
						{login.isPending ? "登录中…" : "登录"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
