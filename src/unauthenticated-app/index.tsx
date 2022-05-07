// 尚未登录的页面，未授权的页面
import { Button, Card, Divider } from 'antd'
import { useState } from 'react'
import LoginScreen from './login'
import RegisterScreen from './register'
import styled from '@emotion/styled'
import logo from 'assets/logo.svg'
import left from 'assets/left.svg'
import right from 'assets/right.svg'

export const UnauthenticatedApp = () => {
  const [isRegister, setIsRegister] = useState(false)
  return (
    <Container>
      <Header />
      <Background />
      <ShadowCard>
        <Title>{isRegister ? '请注册' : '请登录'}</Title>
        {isRegister ? <RegisterScreen /> : <LoginScreen />}
        <Divider />
        <a onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '已经有账号了？直接登录' : '没有账号？注册一个吧'}
        </a>
      </ShadowCard>
    </Container>
  )
}

// 用emotion来写CSS-in-JS的样式模式，然后直接当成组件，html自带的标签用 .
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`
// antd或者其他自定义的标签组件括号 ()
const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`

const Header = styled.header`
  background: url(${logo}) no-repeat center;
  padding: 5rem 0;
  background-size: 8rem;
  width: 100%;
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  /* 背景图片不会随着页面滑动而一起滑动 */
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc(((100vw-40rem) / 2)-3.2rem), calc(((100vw-40rem) / 2)-3.2rem) cover;
  background-image: url(${left}), url(${right});
`

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`

// 导出长按钮样式
export const LongButton = styled(Button)`
  width: 100%;
`
