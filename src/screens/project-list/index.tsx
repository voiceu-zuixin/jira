import { List } from './list'
import { SearchPanel } from './search-panel'
import { useState } from 'react'
import { useDebounce } from 'utils'
import styled from '@emotion/styled'
import { Typography } from 'antd'
import { useProjects } from 'utils/project'
import { useUser } from 'utils/user'

// 引入apiUrl
// const apiUrl = process.env.REACT_APP_API_URL

// 开发模式下函数体是会多次调用的，而且次数是不确定的，hooks的初次渲染调用次数是两次
export const ProjectListScreen = () => {
  // 初始化param，用于一开始的输入框为空白,在子组件里输入后,onChange会触发setParam,
  // 并进行更新param,然后再次传给子组件,进行渲染,保留在输入框
  const [param, setParam] = useState({
    name: '',
    personId: ''
  })

  // 防抖
  const debouncedParam = useDebounce(param, 300)

  // 导入useProjects，内部封装了useAsync，返回值可以直接用
  const { isLoading, error, data: list } = useProjects(debouncedParam)

  // 导入useUsers
  const { data: users } = useUser()

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

const Container = styled.div`
  padding: 3.2rem;
`
