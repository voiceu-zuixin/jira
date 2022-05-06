/* 
  已经注册了的用户是 username:jira  password:jira
*/
import { useAuth } from 'context/auth-context'

// 引入antd组件
import { Button, Form, Input } from 'antd'

// 登录注册模块组件
export default function LoginScreen() {
  // 此处就不用再给useAuth参数了，内部封装了，这样就能直接拿到login，user等参数了
  const { login } = useAuth()

  // 处理提交的方法
  const handleSubmit = (values: { username: string; password: string }) => {
    // 调用login方法，login方法应该由src/context下的index中导入，封装到useAuth里了
    login(values)
  }

  // 页面
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item name={'username'} rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder="用户名" type="text" name="" id={'username'} />
      </Form.Item>

      <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
        <Input placeholder="密码" type="text" name="" id={'password'} />
      </Form.Item>

      <Form.Item>
        <Button htmlType={'submit'} type="primary">
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}
