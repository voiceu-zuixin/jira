/* 
  已经注册了的用户是 username:jira  password:jira
*/
import { Form, Input } from 'antd'
import { useAuth } from 'context/auth-context'
import { LongButton } from 'unauthenticated-app'
import { useAsync } from 'utils/use-async'

// 登录注册模块组件
export default function RegisterScreen({
  onError
}: {
  onError: (error: Error) => void
}) {
  // 此处就不用再给useAuth参数了，内部封装了，这样就能直接拿到login，user等参数了
  const { register } = useAuth()

  // 给注册界面加上loading效果
  const { run, isLoading } = useAsync(undefined, { throwOnError: true })

  // 处理提交的方法
  const handleSubmit = async ({
    cpassword,
    ...values
  }: {
    cpassword: string
    username: string
    password: string
  }) => {
    if (cpassword !== values.password) {
      onError(new Error('请输入两次相同的密码'))
      return
    }

    // 调用register方法，register方法应该由src/context下的index中导入，封装到useAuth里了
    try {
      await run(register(values))
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

      <Form.Item
        name={'cpassword'}
        rules={[{ required: true, message: '请确认密码' }]}
      >
        <Input placeholder="确认密码" type="text" name="" id={'cpassword'} />
      </Form.Item>

      <Form.Item>
        <LongButton loading={isLoading} htmlType={'submit'} type="primary">
          注册
        </LongButton>
      </Form.Item>
    </Form>
  )
}
