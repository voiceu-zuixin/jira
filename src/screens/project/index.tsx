import { Link } from 'react-router-dom'
import { Route, Routes, Navigate, useLocation } from 'react-router'
import KanbanScreen from 'screens/kanban'
import EpicScreen from 'screens/epicScreen'
import styled from '@emotion/styled'
import { Menu, MenuProps } from 'antd'

const useRouteType = () => {
  // 比如把http://localhost:3000/projects/1/epic变成以 / 分割的数组
  const units = useLocation().pathname.split('/')

  // 返回最后一个，比如epic或者kanban
  return units[units.length - 1]
}

export const ProjectScreen = () => {
  const routeType = useRouteType()

  const items: MenuProps['items'] = [
    {
      label: <Link to={'kanban'}>看板</Link>,
      key: 'kanban'
    },
    {
      label: <Link to={'epic'}>任务组</Link>,
      key: 'epic'
    }
  ]
  return (
    <Container>
      {/* <h1>ProjectScreen</h1> */}
      <Aside>
        {/* selectedKeys来控制刷新后高亮 */}
        <Menu mode={'inline'} selectedKeys={[routeType]} items={items}></Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={'/kanban'} element={<KanbanScreen />} />
          <Route path={'/epic'} element={<EpicScreen />} />

          {/* <Navigate to={window.location.pathname + '/kanban'}/> */}
          <Route
            path="*"
            element={
              <Navigate
                to={window.location.pathname + '/kanban'}
                // replace={true} 解决了回退无限循环的bug
                replace={true}
              />
            }
          />
        </Routes>
      </Main>
    </Container>
  )
}

const Aside = styled.div`
  background-color: rgb(244, 245, 247);
  display: flex;
`

const Main = styled.div`
  box-shadow: -5px 0 5px -5px raba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  overflow: hidden;
`
