import { List } from './list'
import { SearchPanel } from './search-panel'
import { useState, useEffect } from 'react'
import { cleanObject, useMount, useDebounce } from 'utils'
import { useHttp } from 'utils/http'
import styled from '@emotion/styled'

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
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])

  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 防抖
  const debouncedParam = useDebounce(param, 300)

  // param改变就会触发的useEffect
  useEffect(() => {
    // 利用useHttp来替换fetch操作，fetch内部的操作在其中已经实现了
    client('projects', { data: cleanObject(debouncedParam) }).then(setList)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedParam])

  // 首次渲染的时候请求user，传给子组件，进行render
  // 换成自定义的useMount，减少空数组
  useMount(() => {
    client('users').then(setUsers)
  }) //不用空数组也可以只在首次渲染的时候执行该函数

  return (
    <Container>
      <h1>项目列表</h1>
      {/* 通过props传入state */}
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </Container>
  )
}

const Container = styled.div`
  padding: 3.2rem;
`
