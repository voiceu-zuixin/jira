// 用了useReducer就可以不用useState
import { useCallback, useReducer, useState } from 'react'
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

// 包装普通的dispatch，内部判断当前组件是否还在挂载中，处于挂载状态就返回dispatch，否则返回undefined
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  // 获取mountedRef，获取到使用useAsync的当前组件的挂载状态
  const mountedRef = useMountedRef()

  // 返回一个dispatch函数
  return useCallback(
    // void 0替代undefined
    // 当处于挂载状态的时候返回dispatch，卸载的时候返回undefined
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),

    // useCallback的依赖
    [dispatch, mountedRef]
  )
}

// useAsync 用于异步请求的时候，loading加载效果能呈现
// 泛型可以看成是，D是类型的形参，就像函数一样
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, ...initialConfig }

  const [state, dispatch] = useReducer(
    // 这个reducer只是把传进来的state和action都解构之后返回当做新state
    // 并且因为Partial，所以action的类型和state一样，并且可以没有部分甚至全部类型，就不包含type这些比较传统的类型了
    // 这里的action甚至可以直接说是newState，进来之后两者合并，newState覆盖state
    (state: State<D>, action: Partial<State<D>>) => {
      // console.log('state', { ...state })
      // console.log('action', { ...action })
      return { ...state, ...action }
    },

    // 初始state
    {
      ...defaultInitialState,
      // 有传入的initialState会覆盖默认的defaultInitialState
      ...initialState
    }
  )

  // 返回一个当前组件处于挂载状态的dispatch，如果不是挂载的，返回的是undefined
  // 所以只要能用，就当做是普通的dispatch，调用的时候依旧传入type和state
  const safeDispatch = useSafeDispatch(dispatch)

  // useState不能直接传入函数，传进去的话会在初次渲染就直接被react调用，是惰性初始化
  // 要想保存一个函数进去，就再多包一层
  const [retry, setRetry] = useState(() => () => {})

  // 异步请求成功，更新state
  const setData = useCallback(
    (data: D) =>
      //传入state，没有type，直接放newState，因为定义的reducer的action类型定义是这样的
      safeDispatch({
        data,
        stat: 'success',
        error: null
      }),
    [safeDispatch]
  )

  // 异步请求失败，更新state
  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        data: null,
        stat: 'error'
      }),
    [safeDispatch]
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

      // 这个时候先把stat变为loading，为什么这里可以只传stat，data和error没传，在打印的时候却能显示
      // {data:null,error:null,stat:loading} ，为什么，这里传进去的新的state，只会替换掉久state的相同属性吗

      // 因为这里的dispatch会把{ stat: 'loading' }当做action传入，在reducer的逻辑里action就是newState了
      safeDispatch({ stat: 'loading' })

      // 异步请求回来了
      return promise
        .then((data) => {
          //如果是成功的，并且，当前的mountedRef是true的话，组件还在挂载就setData
          // 这样可以阻止在已经卸载的组件上进行赋值，比如？暂时缺少例子，不知道是要干什么
          setData(data)

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
    [config.throwOnError, safeDispatch, setData, setError]
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
