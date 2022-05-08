import qs from 'qs'
import * as auth from 'utils/auth-provider'
import { useAuth } from 'context/auth-context'

const apiUrl = process.env.REACT_APP_API_URL

interface Config extends RequestInit {
  data?: object
  token?: string
}

// http函数用于替换fetch操作，并且可以自动携带token等参数，第二个参数默认值为空对象，是为了useMount使用
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-type': data ? 'application/json' : ''
    },
    // 如果customConfig里面有前面的method等参数，是可以覆盖掉的
    ...customConfig
  }

  // 如果是GET请求，要把数据放到url里
  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`
  } else {
    //否则放到body里就行，没有就空对象
    config.body = JSON.stringify(data || {})
  }

  // 为什么这里是window.fetch，而不是直接fetch
  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (responce) => {
    //  如果是401，那么就是 A token must be provided  要登出
    if (responce.status === 401) {
      // 登出
      await auth.logout()
      // 刷新页面
      window.location.reload()
      // 返回一个message
      return Promise.reject({ message: '请重新登录' })
    }

    const data = await responce.json()
    if (responce.ok) {
      return data
    } else {
      // fetch API不会自动抛出异常，比如401,500状态码这些，所以需要手动抛出
      // axios会自动捕获异常，与fetch不一样
      return Promise.reject(data)
    }
  })
}

// 自动携带token，传入http请求中，返回一个函数，该函数运行后会返回fetch请求的结果
export const useHttp = () => {
  const { user } = useAuth()
  // 以下函数跟http的类型是一样的，除了都抽离出来，还有这一种写法
  // return ([endpoint, config]: [string, Config]) => http(endpoint, { ...config, token: user?.token })
  return (...[endpoint, config]: Parameters<typeof http>) =>
    http(endpoint, { ...config, token: user?.token })
}
