
import LoginForm from './login-form'
import PlaceholderImg from '@assets/images/background.png'
import { Icon } from "@iconify/react";
const Login = () => {
    return (
        <div className=' grid lg:grid-cols-2 min-h-svh '>
            <div className='flex flex-col p-6 gap-4 md:p-10'>
                <div className='felx'>
                    <div className='flex items-center gap-2 justify-center md:justify-start'>
                        <Icon icon="solar:code-square-bold" color='pink' fontSize={36} />
                        <span>Sakura Minecraft Server Community | 后台管理系统</span>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center ">
                        <LoginForm />
                </div>
            </div>
            <div className="relative hidden bg-background-paper lg:block">
                <img
                    src={PlaceholderImg}
                    alt="placeholder img"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
                />
            </div>
        </div>
    )
}

export default Login