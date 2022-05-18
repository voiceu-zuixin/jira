import styled from '@emotion/styled'
import { ButtonNoPadding, Row } from 'components/lib'
import { useAuth } from 'context/auth-context'
import { ProjectListScreen } from 'screens/project-list'
import { ReactComponent as SoftwareLogo } from 'assets/software-logo.svg'
import { Button, Dropdown, Menu, MenuProps } from 'antd'
// https://github.com/remix-run/react-router/blob/main/docs/getting-started/installation.md
import { Navigate, Routes, Route } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
/*  
react-router 和 react-router-dom 的关系类似于 react 和 react-dom /react-native
react是核心，react-dom主要把逻辑应用到浏览器上，react-native主要把逻辑应用到ios/Android
*/
import { ProjectScreen } from 'screens/project'
import { resetRoute } from 'utils'
import ProjectModal from 'screens/project-list/project-modal'
import ProjectPopover from 'screens/project-list/project-popover'

export default function AuthenticatedAapp() {
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          {/* BrowserRouter as Router */}
          {/*  react-router 6之后，路由都需要routes包裹起来 */}
          <Routes>
            <Route path={'/projects'} element={<ProjectListScreen />} />
            <Route
              path={'/projects/:projectId/*'}
              element={<ProjectScreen />}
            />
            {/* <Navigate to={'/projects'} /> */}
            {/* 要用这种方式才能用上Navigate ，进行路由兜底*/}
            <Route
              path="*"
              element={<Navigate to="/projects" replace={true} />}
            />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  )
}

// PageHeader组件
const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        {/* ButtonNoPadding 继承了Button的所有属性 */}
        <ButtonNoPadding type={'link'} onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38,132,255'} />
        </ButtonNoPadding>
        <ProjectPopover />
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  )
}

const User = () => {
  const { logout, user } = useAuth()

  // antd4.20.0开始已经舍弃了Menu之前的写法，现在要写items,具体看https://ant.design/components/menu-cn/
  const items: MenuProps['items'] = [
    {
      label: (
        <Button type={'link'} onClick={logout}>
          登出
        </Button>
      ),
      key: 'logout'
    }
  ]
  return (
    <Dropdown overlay={<Menu items={items}></Menu>}>
      <Button type={'link'} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
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

const Main = styled.main`
  display: flex;
  overflow: hidden;
`
