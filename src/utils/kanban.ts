import { useHttp } from './http'
import { QueryKey, useMutation, useQuery } from 'react-query'
import { Kanban } from 'types/kanban'
import {
  useAddConfig,
  useDeleteConfig,
  useReorderKanbanConfig
} from './use-optimistic-options'

export const useKanbans = (param?: Partial<Kanban>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 用useQuery来代替useAsync

  // 第一个参数是数组的时候，当里面的依赖变化的时候，useQuery就会被触发
  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  )
}

// useAddKanban
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        data: params,
        method: 'POST'
      }),
    useAddConfig(queryKey)
  )
}

// useDeleteKanban
export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}

export interface SortProps {
  // 要重新排序的item
  fromId: number
  // 目标item
  referenceId: number
  // 放在目标item的前还是后
  type: 'before' | 'after'

  fromKanbanId?: number
  toKanbanId?: number
}

// 拖拽后重排序
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation((params: SortProps) => {
    return client('kanbans/reorder', {
      data: params,
      method: 'POST'
    })
  }, useReorderKanbanConfig(queryKey))
}
