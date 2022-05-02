import { List } from './list'
import { SearchPanel } from './search-panel'
import { useState, useEffect } from 'react'
import { cleanObject, useMount, useDebounce } from 'utils'
import qs from 'qs'

// 引入apiUrl
const apiUrl = process.env.REACT_APP_API_URL

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

  // 防抖
  const debouncedParam = useDebounce(param, 300)

  // param改变就会触发的useEffect
  useEffect(() => {
    // fetch请求/project路由，GET方式
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`)
      // 返回一个promise对象，response带有响应数据
      .then(async (response) => {
        if (response.ok) {
          // 更新list数组,response.json()是一个有成功的promise对象，await后变成其结果，
          // 此处是数组，更新过后，会传给子组件List
          setList(await response.json())
        }
      })
  }, [debouncedParam])

  // 首次渲染的时候请求user，传给子组件，进行render
  // 换成自定义的useMount，减少空数组
  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        // 更新user
        setUsers(await response.json())
      }
    })
  }) //不用空数组也可以只在首次渲染的时候执行该函数

  return (
    <div>
      {/* 通过props传入state */}
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  )
}
