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
          // 如果前面有dataIndex，那么第一个参数就是dataIndex对应的value作为key所对应值
          // 如果没有，那么第一第二都是一样的数据
          // 第三个参数是dataIndex
          render(project) {
            return <span>{users.find((user) => user.id === project.personId)?.name || '未知'}</span>
          }
        }
      ]}
      dataSource={list}
    ></Table>
  )
}
