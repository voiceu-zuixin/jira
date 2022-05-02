const apiUrl = process.env.REACT_APP_API_URL

export default function LoginScreen() {
  const login = (param: { username: string; password: string }) => {
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(param)
    }).then(async (response) => {
      if (response.ok) {
        // 暂时不做操作
      }
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const username = (event.currentTarget.elements[0] as HTMLInputElement).value
    const password = (event.currentTarget.elements[1] as HTMLInputElement).value
    login({ username, password })
  }
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
      <button type="submit">登录</button>
    </form>
  )
}
