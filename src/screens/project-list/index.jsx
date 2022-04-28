// import React from 'react'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { useState, useEffect } from 'react'

// 引入apiUrl
const apiUrl = process.env.REACT_APP_API_URL

export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: ''
  })
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // then里的函数会异步执行，所以添加async，变成同步
    // fetch()得到一个确定的resolve或者reject结果response后，才会进入then
    fetch(`${apiUrl}/projects`).then(async (response) => {
      if (response.ok) {
        // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
        // 此处就是等待，但是我认为这里不写await也行，因为进入then的时候response应该已经确定了
        // pending的话进不去后面的
        setList(await response.json())
      }
    })
  }, [param])

  // 初次渲染的时候把users也请求下来
  useEffect(() => {
    // then里的函数会异步执行，所以添加async，变成同步
    // fetch()得到一个确定的resolve或者reject结果response后，才会进入then
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
        // 此处就是等待，但是我认为这里不写await也行，因为进入then的时候response应该已经确定了
        // pending的话进不去后面的
        setUsers(await response.json())
      }
    })
  }, [param])

  return (
    <div>
      {/* 通过props传入state */}
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  )
}
