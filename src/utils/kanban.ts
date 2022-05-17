import { useHttp } from './http'
import { useQuery } from 'react-query'
import { Kanban } from 'types/kanban'

export const useKanbans = (param?: Partial<Kanban>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 用useQuery来代替useAsync

  // 第一个参数是数组的时候，当里面的依赖变化的时候，useQuery就会被触发
  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  )
}