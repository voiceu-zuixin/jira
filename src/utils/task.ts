import { useHttp } from './http'
import { QueryKey, useMutation, useQuery } from 'react-query'
import { Task } from 'types/task'
import { cleanObject } from 'utils'
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderTaskConfig
} from './use-optimistic-options'
import { SortProps } from './kanban'

// task的react-query缓存，以及请求等数据
export const useTasks = (param?: Partial<Task>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 用useQuery来代替useAsync

  // 第一个参数是数组的时候，当里面的依赖变化的时候，useQuery就会被触发，第二个参数是获取数据的功能函数
  // useQuery的返回值具有较多属性，重要的比如data，refetch，isLoading等
  return useQuery<Task[]>(['tasks', param], () =>
    client('tasks', { data: cleanObject(param || {}) })
  )
}

// useAddTask
export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: 'POST'
      }),
    useAddConfig(queryKey)
  )
}

// 获取具体的task详情
export const useTask = (id?: number) => {
  const client = useHttp()
  return useQuery<Task>(['task', { id }], () => client(`tasks/${id}`), {
    // 当id是undefined的时候，就不需要请求了
    enabled: Boolean(id)
  })
}

// 这里不要在参数里写要传入，因为这个函数如果写了就是要被用到onCheckedChange内部，
// 而hook是不能被当做普通函数的回调函数的
// 所以需要的pin的参数，直接用异步请求获取，曲线救国
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp()

  // 返回一个对象，里面是一个函数  { mutate }
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        data: params,
        method: 'PATCH'
      }),
    useEditConfig(queryKey)
  )
}

// useDeleteTask
export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}

// 拖拽后重排序
export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation((params: SortProps) => {
    return client('tasks/reorder', {
      data: params,
      method: 'POST'
    })
  }, useReorderTaskConfig(queryKey))
}
