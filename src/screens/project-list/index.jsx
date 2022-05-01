import { List } from './list'
import { SearchPanel } from './search-panel'
import { useState, useEffect } from 'react'
import { cleanObject, useMount ,useDebounce} from 'utils'
import qs from 'qs'

// 引入apiUrl
const apiUrl = process.env.REACT_APP_API_URL

// 开发模式下函数体是会多次调用的，而且次数是不确定的，hooks的初次渲染调用次数是两次
export const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: ''
  })
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])
  // 不要在函数式组件体内部写直接运行的函数，除了hook
  // console.log(param)


  const debouncedParam = useDebounce(param,2000)

  // 为什么初次渲染的时候会请求两次呢，初步排查是react18的原因，同样的代码在17里面不会
  // 所以看看issue，要不然就只能这样，或者降低版本，但是这个是脚手架搭建的，所以看看怎么重新弄一个低版本的
  // 具体是因为18的入口文件，现在用的新形式
  useEffect(() => {
    console.log('发送请求')
    // then里的函数会异步执行，所以添加async，变成同步
    // fetch()得到一个确定的resolve或者reject结果response后，才会进入then
    // `${apiUrl}/projects?name=${param.name}&personId=${param.personId}`太麻烦，可以用qs的包来完成

    // fetch(`${apiUrl}/projects?name=${param.name}&personId=${param.personId}`).then(
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(
      async (response) => {
        if (response.ok) {
          // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
          // 此处就是等待，但是我认为这里不写await也行，因为进入then的时候response应该已经确定了
          // pending的话进不去后面的，事实证明不是这样的，
          // 跟普通promise不同，response对象是一个Response 对象，其中Response.json()方法会返回一个Promise对象
          //等待response.json()，该函数返回的是一个Promise对象，随后更新list
          let res = await response.json()
          console.log('res', res)
          // setList 会导致多次调用整个函数式组件体，，相对于componentWillUpdate的生命周期，又会重新渲染
          // 然后每次调用setList又会重新渲染，又走两次函数组件体，挂载一次卸载一次又挂载一次
          // 但是这次useEffect这些hook就不一定会被调用，因为数组里的param没变
          // 经过测试，大多数情况下重复调用2次，但是也有其他次数的时候
          // 所以次数不受控，不知道会重复调用多少次
          setList(res)
          // setList(await response.json())
        }
      }
    )
  }, [debouncedParam])
  // 初次渲染的时候把users也请求下来
  // useEffect(() => {
  //   // then里的函数会异步执行，所以添加async，变成同步
  //   // fetch()得到一个确定的resolve或者reject结果response后，才会进入then
  //   fetch(`${apiUrl}/users`).then(async (response) => {
  //     if (response.ok) {
  //       // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
  //       // 此处就是等待，但是我认为这里不写await也行，因为进入then的时候response应该已经确定了
  //       // pending的话进不去后面的
  //       setUsers(await response.json())
  //     }
  //   })
  // }, [])//空数组代表只在首次渲染的时候执行该函数

  // 换成自定义的useMount，减少空数组
  useMount(() => {
    console.log('useMount')
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
  }) //不用空数组也可以只在首次渲染的时候执行该函数


  return (
    <div>
      {/* 通过props传入state */}
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  )
}
