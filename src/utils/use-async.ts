import { useCallback, useState } from 'react'
import { useMountedRef } from 'utils'

interface State<D> {
  data: D | null
  error: Error | null
  // status的缩写
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  data: null,
  error: null,
  stat: 'idle'
}

// 当不是接口而是类/对象的时候，就用typeof就行
const defaultConfig = {
  throwOnError: false
}

// useAsync 用于异步请求的时候，loading加载效果能呈现
// 泛型可以看成是，D是类型的形参，就像函数一样
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState
  })

  // 获取mountedRef，获取到使用useAsync的当前组件的挂载状态
  const mountedRef = useMountedRef()

  // useState不能直接传入函数，传进去的话会在初次渲染就直接被react调用，是惰性初始化
  // 要想保存一个函数进去，就再多包一层
  const [retry, setRetry] = useState(() => () => {})

  // 异步请求成功，更新state
  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        stat: 'success',
        error: null
      }),
    []
  )

  // 异步请求失败，更新state
  const setError = useCallback(
    (error: Error) =>
      setState({
        error,
        data: null,
        stat: 'error'
      }),
    []
  )

  //用于触发异步请求，内部会调用setData或者setError
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      // 如果不是Promise类型，就报错
      if (!promise || !promise.then) {
        throw new Error('请传入 Promise 类型数据')
      }

      //多包一层，state里存入函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig)
        }
      })

      // 这个时候先把state变为loading
      setState((prevState) => ({ ...prevState, stat: 'loading' }))

      // 异步请求回来了
      return promise
        .then((data) => {
          //如果是成功的，并且，当前的mountedRef是true的话，组件还在挂载就setData
          // 这样可以阻止在已经卸载的组件上进行赋值，比如？暂时缺少例子，不知道是要干什么
          if (mountedRef.current) setData(data)

          return data
        })
        .catch((error) => {
          //如果遇到异常，就setError
          setError(error)
          // 如果throwOnError为true，就要抛出promise对象
          if (config.throwOnError) return Promise.reject(error)
          return error
        })
    },
    [config.throwOnError, mountedRef, setData, setError]
  )

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    // 当retry被调用的时候，重新跑一遍run
    retry,
    ...state
  }
}
