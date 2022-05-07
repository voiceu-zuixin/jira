/* 
  已经注册了的用户是 username:jira  password:jira
*/
import { Form, Input } from 'antd'
import { useAuth } from 'context/auth-context'
import { LongButton } from 'unauthenticated-app'

// 登录注册模块组件
export default function RegisterScreen() {
  // 此处就不用再给useAuth参数了，内部封装了，这样就能直接拿到login，user等参数了
  const { register } = useAuth()

  // 处理提交的方法
  const handleSubmit = (values: { username: string; password: string }) => {
    // 调用register方法，register方法应该由src/context下的index中导入，封装到useAuth里了
    register(values)
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
        <LongButton htmlType={'submit'} type="primary">
          注册
        </LongButton>
      </Form.Item>
    </Form>
  )
}
