import { User } from 'screens/project-list/search-panel'
import { useEffect } from 'react'
import { cleanObject } from 'utils'
import { useHttp } from './http'
import { useAsync } from './use-async'

export const useUser = (param?: Partial<User>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 导入useAsync
  const { run, ...result } = useAsync<User[]>()

  // param改变就会触发的useEffect
  useEffect(() => {
    // 为了让异步请求尚未返回的时候有loading效果
    run(client('users', { data: cleanObject(param || {}) }))
  }, [param, run, client])

  return result
}
