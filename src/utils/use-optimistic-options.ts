import { QueryKey, useQueryClient } from 'react-query'

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient()

  return {
    // 成功的时候的回调，queryClient.invalidateQueries使得匹配的查询失效并重新获取
    // 用于即时刷新，相对于retry
    onSuccess: () => queryClient.invalidateQueries(queryKey),

    // useMutation一发生，onMutate就发生
    // 乐观更新：在网络较慢的情况下，响应还没回来的时候，先在前端把响应做出来，提高用户体验
    async onMutate(target: any) {
      // 通过queryKey查询得到对应的数据
      const previousItems = queryClient.getQueryData(queryKey)

      // 操作要改的数据
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old)
      })

      return { previousItems }
    },
    
    // 当useMutation的请求发生错误的时候，就调用该函数
    // 逻辑上是useMutation一发生，会先调用onMutate，这个时候乐观更新，但是当响应返回来的时候发现请求失败了
    // 就应该把乐观更新提前响应的内容清空，回滚到之前的状态，此时就调用onError
    onError(error: any, newItem: any, context: any) {
      //context可以获取到onMutate返回的值
      queryClient.setQueryData(queryKey, context.previousItems)
    }
  }
}

// 细分各个不同的功能，delete、add、edit
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  )

//useEditConfig
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  )

// useAddConfig
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []))
