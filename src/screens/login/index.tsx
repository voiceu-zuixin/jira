// 登录注册模块组件
export default function LoginScreen() {
  const login = (param: { username: string; password: string }) => {}

  // 处理提交的方法
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    // 首先禁止掉默认行为，因为要做预处理
    event.preventDefault()

    // 处理username和password
    const username = (event.currentTarget.elements[0] as HTMLInputElement).value
    const password = (event.currentTarget.elements[1] as HTMLInputElement).value

    // 调用login方法，login方法应该由src/context下的index中导入
    login({ username, password })
  }

  // 页面
  return (
    <form action="" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        {/* 就是要让id为字符串的username，而不是变量username */}
        <input type="text" name="" id={'username'} />
      </div>
      <div>
        <label htmlFor="password">密码</label>
        <input type="text" name="" id={'password'} />
      </div>
      <button type="submit">注册</button>
    </form>
  )
}
