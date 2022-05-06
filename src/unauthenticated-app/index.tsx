// 尚未登录的页面，未授权的页面
import { Card } from 'antd'
import { useState } from 'react'
import LoginScreen from './login'
import RegisterScreen from './register'

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false)
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <button onClick={() => setIsRegister(!isRegister)}>
          切换到{isRegister ? '登录' : '注册'}页面
        </button>
      </Card>
    </div>
  )
}
