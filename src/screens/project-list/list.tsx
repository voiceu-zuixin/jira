// 引入User类型
import { User } from 'screens/project-list/search-panel'

interface Project {
  id: string
  name: string
  personId: string
  pin: boolean
  organization: string
}

interface ListProps {
  list: Project[]
  users: User[]
}

export const List = ({ list, users }: ListProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        {/* 根据list和user来渲染页面 */}
        {list.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            {/* ?. 有点类似三元运算符 */}
            <td>
              {users.find((user) => user.id === project.personId)?.name ||
                '未知'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
