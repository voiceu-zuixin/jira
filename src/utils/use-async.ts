import { useState } from 'react'

interface State<D> {
  error: Error | null
  data: D | null
  // status的缩写
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  error: null,
  data: null,
  stat: 'idle'
}

// 泛型可以看成是，D是类型的形参，就像函数一样
export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState
  })

  // 异步请求成功，更新state
  const setData = (data: D) =>
    setState({
      data,
      stat: 'success',
      error: null
    })

  // 异步请求失败，更新state
  const setError = (error: Error) =>
    setState({
      error,
      data: null,
      stat: 'error'
    })

  //用于触发异步请求，内部会调用setData或者setError
  const run = (promise: Promise<D>) => {
    // 如果不是Promise类型，就报错
    if (!promise || !promise.then) {
      throw new Error('请传入 Promise 类型数据')
    }

    // 这个时候先把state变为loading
    setState({ ...state, stat: 'loading' })

    // 异步请求回来了
    return promise
      .then((data) => {
        //如果是成功的，就setData
        setData(data)
        return data
      })
      .catch((error) => {
        //如果遇到异常，就setError
        setError(error)
        return error
      })
  }

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state
  }
}