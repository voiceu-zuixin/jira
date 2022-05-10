// 引入User类型
import { Table, TableProps } from 'antd'
import { User } from 'screens/project-list/search-panel'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Pin } from 'components/pin'
import { useEditProject } from 'utils/project'

// TODO 把所有ID都改成number类型
export interface Project {
  id: number
  name: string
  personId: number
  pin: boolean
  organization: string
  created: number
}

interface ListProps extends TableProps<Project> {
  users: User[]
}

export const List = ({ users, ...props }: ListProps) => {
  // 拿到mutate，然后使用
  const { mutate } = useEditProject()

  // 用柯里化来改造不同时机才能获取参数的函数
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin })

  return (
    <Table
      // Table组件必须要有不同的key，这里暂时写一个随机的key函数
      rowKey={'id'}
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(project) {
            // 当onCheckedChange时，要向服务器发送改变pin的请求
            return (
              <Pin
                checked={project.pin}
                // 自己定义的函数，为什么知道传入的参数就是pin
                // 因为这个传进去，是作用到Rate的onChange里的，而这里的pin是我们主动传入的
                onCheckedChange={pinProject(project.id)}
              />
            )
          }
        },
        {
          title: '名称',
          // dataIndex: 'name',
          // localeCompare可以排序中文字符
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(project) {
            // 这里的to虽然是导向project.id，但是会自动在上层路由下添加该project.id，形成子路由
            // 而且注意，这里的Link的to后面没有加 / ，加了 / 就是根路由了
            return <Link to={String(project.id)}>{project.name}</Link>
          }
        },
        {
          title: '部门',
          dataIndex: 'organization'
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
        },
        {
          title: '创建时间',
          render(project) {
            return (
              <span>{project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}</span>
            )
          }
        }
      ]}
      // 这其中包含了剩余的属性，比如DataSource
      {...props}
    ></Table>
  )
}
