import { List } from './list'
import { SearchPanel } from './search-panel'
import { useDebounce, useDocumentTitle } from 'utils'
import styled from '@emotion/styled'
import { Typography } from 'antd'
import { useProjects, useProjectSearchParams } from 'utils/project'
import { useUser } from 'utils/user'

// 引入apiUrl
// const apiUrl = process.env.REACT_APP_API_URL

// 开发模式下函数体是会多次调用的，而且次数是不确定的，hooks的初次渲染调用次数是两次
export const ProjectListScreen = () => {
  // 更改当前页面的title
  useDocumentTitle('项目列表', false)

  // 从useProjectSearchParams中拿到从url中的表单把string转换为number的param
  const [param, setParam] = useProjectSearchParams()

  // 防抖
  const debouncedParam = useDebounce(param, 300)

  // 导入useProjects，内部封装了useAsync，返回值是可以直接用
  const { isLoading, error, data: list, retry } = useProjects(debouncedParam)

  // 导入useUsers
  const { data: users } = useUser()

  return (
    <Container>
      <h1>项目列表</h1>

      {/* 通过props传入state */}
      <SearchPanel users={users || []} param={param} setParam={setParam} />

      {/* 如果异步请求出错了，就渲染message */}
      {error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null}

      <List refresh={retry} loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  )
}

// 追踪ProjectListScreen组件，为什么渲染
ProjectListScreen.whyDidYouRender = false

const Container = styled.div`
  padding: 3.2rem;
`
