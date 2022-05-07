import styled from '@emotion/styled'
import { Row } from 'components/lib'
import { useAuth } from 'context/auth-context'
import { ProjectListScreen } from 'screens/project-list'

export default function AuthenticatedAapp() {
  const { logout } = useAuth()
  return (
    <Container>
      <Header between={true}>
        <HeaderLeft gap={true}>
          <h2>Logo</h2>
          <h2>项目</h2>
          <h2>用户</h2>
        </HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectListScreen />
      </Main>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  height: 100vh;
  /* 上方行6rem 下方自适应，这里的话就是100vh-6rem*/
  grid-template-rows: 6rem 1fr;
`

const Header = styled(Row)``

// 引入component下定义的Row组件，可以传入gap属性
const HeaderLeft = styled(Row)``

const HeaderRight = styled.div``

const Main = styled.main``
