import { useEffect } from 'react'
import { cleanObject } from 'utils'
import { useHttp } from './http'
import { useAsync } from './use-async'
import { Project } from 'screens/project-list/list'

export const useProjects = (param?: Partial<Project>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 导入useAsync
  const { run, ...result } = useAsync<Project[]>()

  // param改变就会触发的useEffect
  useEffect(() => {
    // 为了让异步请求尚未返回的时候有loading效果
    run(client('projects', { data: cleanObject(param || {}) }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  return result
}
