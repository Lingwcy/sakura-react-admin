import './index.scss'
import {
    Card,
    Form,
    Input,
    Button,
    message
} from 'antd'
import logo from '@assets/logo.png'
import { useUserToken } from '@/hooks/useUser'
import { useNavigate } from 'react-router'
interface LoginFormValues {
    mobile: string;
    code: string;
}
const Login = () => {
    const {sinIn, userToken} = useUserToken()
    const navigate = useNavigate()
    console.log(userToken)

    const handleFormSubmit = async (value: LoginFormValues): Promise<void> => {
        try {
            await sinIn(value)
            message.success("登录成功")
            navigate('/')
        } catch {
            const errorMessage = "登录失败，请重试";
            message.error(errorMessage);
        }
    }
    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form
                    validateTrigger="onBlur"
                    onFinish={handleFormSubmit}>
                    <Form.Item
                        name="mobile"
                        // 多条校验逻辑 先校验第一条 第一条通过之后再校验第二条
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号',
                            },
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入正确的手机号格式'
                            }
                        ]}>
                        <Input size="large" placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}>
                        <Input size="large" placeholder="请输入验证码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login