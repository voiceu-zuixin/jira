// 在真实环境中，如果使用firebase这种第三方auth服务的话，本文件不需要开发者开发

// localStorage的用法：https://blog.csdn.net/itdabaotu/article/details/90598629
/* 
localStorage只支持string类型的存储
let storage = window.localStorage 可以得到整个数据库以下

  key | value
  a   |  1
  b   |  2

增：Storage.setItem(key: string, value: string): void
删：Storage.removeItem(key: string): void
改：storage[key] = value 即可，类似改对象属性，或者storage.key = value 
查：Storage.getItem(key: string): string | null
*/

import { User } from 'screens/project-list/search-panel'

const apiUrl = process.env.REACT_APP_API_URL

// 定义auth字段作为key
const localStorageKey = '__auth_provider_token__'

// getToken方法，得到auth字段的value
export const getToken = () => window.localStorage.getItem(localStorageKey)

// handleUserResponse方法，将传入的response中的token存入auth字段的value
export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(localStorageKey, user.token || '')
  return user
}

// login逻辑，传入表单收集的data，返回一个promise对象，结果是user或者失败，成功的话，localStorage就已经存好了token
export const login = (data: { username: string; password: string }) => {
  // 通过fetch请求/login，body为data的数据，返回最终then后的promise对象出去
  return fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(async (response) => {
    // 如果成功返回response数据，后续的操作会拿到这个user，进行更新当前state里的user
    // 就返回一个结果为经过handleUserResponse方法处理后的user的promise对象
    if (response.ok) {
      return handleUserResponse(await response.json())
    } else {
      //否则返回一个失败的promise对象
      return Promise.reject(await response.json())
    }
  })
}

// 注册逻辑同理
export const register = (data: { username: string; password: string }) => {
  return fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json())
    } else {
      return Promise.reject(await response.json())
    }
  })
}

// 退出，就是把auth字段删除，async变成一个异步函数，返回值是promise对象
export const logout = async () => window.localStorage.removeItem(localStorageKey)
