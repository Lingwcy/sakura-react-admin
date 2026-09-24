
import LoginForm from './login-form'
import PlaceholderImg from '@assets/images/background.png'
const Login = () => {
    return (
        <div className=' grid lg:grid-cols-2 min-h-svh '>
            <div className='flex flex-col p-6 gap-4 md:p-10'>
                <div className='felx'>
                    <div className='flex items-center gap-2 justify-center md:justify-start'>
                        <img src="/brand/oolong-comics-logo-banner.svg" alt="Oolong Comics" className="h-9 w-auto max-w-[190px] object-contain object-left" />
                        <span className="border-l pl-2 text-sm font-medium text-muted-foreground">管理后台</span>
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
