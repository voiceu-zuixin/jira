import { Link } from 'react-router-dom'
import { Route, Routes, Navigate } from 'react-router'
import KanbanScreen from 'screens/kanban'
import EpicScreen from 'screens/epicScreen'

export default function ProjectScreen() {
  return (
    <div>
      <h1>ProjectScreen</h1>
      <Link to={'kanban'}>看板</Link>
      <Link to={'epic'}>任务组</Link>
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
    </div>
  )
}
