import { List } from './list'
import { SearchPanel } from './search-panel'
import { useDebounce, useDocumentTitle } from 'utils'
import styled from '@emotion/styled'
import { Typography } from 'antd'
import { useProjects } from 'utils/project'
import { useUser } from 'utils/user'
import { useUrlQueryParam } from 'utils/url'

// 引入apiUrl
// const apiUrl = process.env.REACT_APP_API_URL

// 开发模式下函数体是会多次调用的，而且次数是不确定的，hooks的初次渲染调用次数是两次
export const ProjectListScreen = () => {
  // 初始化param，用于一开始的输入框为空白,在子组件里输入后,onChange会触发setParam,
  // 并进行更新param,然后再次传给子组件,进行渲染,保留在输入框

  // 从url中获取param，这种解构是按顺序来的
  const [param, setParam] = useUrlQueryParam(['name', 'personId'])

  // 防抖
  const debouncedParam = useDebounce(param, 300)

  // 导入useProjects，内部封装了useAsync，返回值是可以直接用
  const { isLoading, error, data: list } = useProjects(debouncedParam)

  // 导入useUsers
  const { data: users } = useUser()

  useDocumentTitle('项目列表', false)

  return (
    <Container>
      <h1>项目列表</h1>

      {/* 通过props传入state */}
      <SearchPanel users={users || []} param={param} setParam={setParam} />

      {/* 如果异步请求出错了，就渲染message */}
      {error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}

      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  )
}

// 追踪ProjectListScreen组件，为什么渲染
ProjectListScreen.whyDidYouRender = false

const Container = styled.div`
  padding: 3.2rem;
`
