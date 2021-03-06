/* 
  已经注册了的用户是 username:jira  password:jira
*/
import { useAuth } from 'context/auth-context'

// 引入antd组件
import { Form, Input } from 'antd'
import { LongButton } from 'unauthenticated-app'
import { useAsync } from 'utils/use-async'

// 登录注册模块组件
export default function LoginScreen({
  onError
}: {
  onError: (error: Error) => void
}) {
  // 此处就不用再给useAuth参数了，内部封装了，这样就能直接拿到login，user等参数了
  const { login } = useAuth()

  // 给登录界面加上loading效果
  const { run, isLoading } = useAsync(undefined, { throwOnError: true })

  // 处理提交的方法
  const handleSubmit = async (values: {
    username: string
    password: string
  }) => {
    // 调用login方法，login方法应该由src/context下的index中导入，封装到useAuth里了
    try {
      await run(login(values))
    } catch (error) {
      onError(error as Error)
    }
  }

  // 页面
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={'username'}
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" type="text" name="" id={'username'} />
      </Form.Item>

      <Form.Item
        name={'password'}
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input placeholder="密码" type="text" name="" id={'password'} />
      </Form.Item>

      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type="primary">
          登录
        </LongButton>
      </Form.Item>
    </Form>
  )
}
