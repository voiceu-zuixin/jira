import styled from '@emotion/styled'
import { Row } from 'components/lib'
import { useAuth } from 'context/auth-context'
import { ProjectListScreen } from 'screens/project-list'
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg'
import { Dropdown, Menu } from 'antd'
// import softwareLogo from 'assets/software-logo.svg'

export default function AuthenticatedAapp() {
  const { logout, user } = useAuth()
  return (
    <Container>
      <Header between={true}>
        <HeaderLeft gap={true}>
          {/* <img src={softwareLogo} alt=''/> */}
          <SoftwareLogo width={'18rem'} color={'rgb(38,132,255'} />
          <h2>项目</h2>
          <h2>用户</h2>
        </HeaderLeft>
        <HeaderRight>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key={'logout'}>
                  <a onClick={logout}>登出</a>
                </Menu.Item>
              </Menu>
            }
          >
            <a onClick={(e) => e.preventDefault()}>Hi,{user?.name}</a>
          </Dropdown>
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

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`

// 引入component下定义的Row组件，可以传入gap属性
const HeaderLeft = styled(Row)``

const HeaderRight = styled.div``

const Main = styled.main``
