// 引入User类型
import { Table } from 'antd'
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
    <Table
      pagination={false}
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
          // localeCompare可以排序中文字符
          sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
          title: '负责人',
          // render函数具体参数的意义，看一下之前记录的帖子，还有官方文档
          render(project) {
            return <span>{users.find((user) => user.id === project.personId)?.name || '未知'}</span>
          }
        }
      ]}
      dataSource={list}
    ></Table>
  )
}
