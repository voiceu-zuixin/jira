// 引入User类型
import { Dropdown, Menu, MenuProps, Table, TableProps } from 'antd'
import { User } from 'screens/project-list/search-panel'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Pin } from 'components/pin'
import { useEditProject, useProjectsMoal } from 'utils/project'
import { ButtonNoPadding } from 'components/lib'

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
  // refresh?: () => void
  // projectButton: JSX.Element
}

export const List = ({ users, ...props }: ListProps) => {
  const { open } = useProjectsMoal()

  // 拿到mutate，然后使用
  const { mutate } = useEditProject()

  // 用于编辑
  const { startEdit } = useProjectsMoal()

  const editProject = (id: number) => () => startEdit(id)

  // antd4.20.0开始已经舍弃了Menu之前的写法，现在要写items,具体看https://ant.design/components/menu-cn/
  // 但是这样就无法把外部Menu的参数传给items了
  // 因为新版的Menu无法让item得到父组件Menu的props，所以写一个函数，传入props，返回其绑定的item
  const getItems = (project: Project) => {
    const item: MenuProps['items'] = [
      {
        label: (
          <ButtonNoPadding onClick={open} type={'link'}>
            创建项目
          </ButtonNoPadding>
        ),
        key: 'add'
      },
      {
        label: '编辑',
        onClick: editProject(project.id),
        key: 'edit'
      },
      {
        label: '删除',
        key: 'delete'
      }
    ]
    return item
  }

  // 用柯里化来改造不同时机才能获取参数的函数
  // 通过then来让点击收藏后自动刷新页面
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin })
  // 不用自动刷新了，用来useQuery，可以实现自动刷新，相对于缓存一样，还不带屏闪
  // .then(props.refresh)

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
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  '未知'}
              </span>
            )
          }
        },
        {
          title: '创建时间',
          render(project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format('YYYY-MM-DD')
                  : '无'}
              </span>
            )
          }
        },
        {
          // 编辑栏，用于edit，也有创建项目等
          title: '操作',
          render(project) {
            return (
              <Dropdown overlay={<Menu items={getItems(project)}></Menu>}>
                <ButtonNoPadding type={'link'}>...</ButtonNoPadding>
              </Dropdown>
            )
          }
        }
      ]}
      // 这其中包含了剩余的属性，比如DataSource
      {...props}
    ></Table>
  )
}
