import { useEffect, useRef, useState } from 'react'

// 判断是0还是undefined或者null，只有后两者才是真的false
export const isFalsy = (value: unknown) => (value === 0 ? false : !value)

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === ''

// 删除空属性
export const cleanObject = (object: { [key: string]: unknown }) => {
  // 在一个函数里，改变传入的对象本身是不好的，所以新建一个一样的对象result
  // Object.assign({},object)
  const result = { ...object }

  // 对result内部的所有key进行遍历，如果该key的value是undefined或者null，就删除该key
  // 但是要防范value为0的时候，所以另写一个isFalsy函数
  Object.keys(result).forEach((key) => {
    // 还可以通过这种方式来达到ts不报错的效果@ts-ignore
    const value = result[key]
    if (isVoid(value)) {
      delete result[key]
    }
  })
  return result
}

// 自定义一个CommonentDidMount生命周期钩子的hook，useMount
// 目的是看到useEffect充当只在第一次渲染的时候执行的情况下，有空数组看着不好
// hook必须要以use开头
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback()
    //这样可以让eslint对下行不报错
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// 后面用泛型来规范返回值，不要用any，泛型相对于，先来一个占位符（形参），我不知道你到底给什么类型
// 最后真正用的时候，爱给什么类型给什么类型
// 定义防抖hook
export const useDebounce = <V>(value: V, delay?: number) => {
  // 用useState来定义一直改变的value，变成到最后防抖后的最终value
  const [debouncedValue, setDebouncedValue] = useState(value)

  // 当value或者delay发生改变的时候，执行useEffect内部逻辑
  useEffect(() => {
    // 定义一个timeout，在delay之后执行改变value到最终值的操作
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 返回一个取消定时器的函数，useEffect的return会在外部组件（此处就是useDebounce函数了）卸载的时候被自动调用
    // React 会在组件卸载的时候执行清除操作。effect 在每次渲染的时候都会执行。
    // React 会在执行当前 effect 之前对上一个 effect 进行清除。如何清除，就是调用return的函数
    /* 
    useEffect 中 return 的函数，在下一次 useEffect 执行前执行，则模拟 DidUpdate；
    useEffect 中 return 的函数，在组件销毁前前执行，则模拟 WillUnmount ；
    */
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

// 改变html的title
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  // 记录旧title，useEffect空数组依赖的时候用这种方式
  // const oldTitle = document.title

  // 记录旧title，用useRef
  const oldTitle = useRef(document.title).current

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // 如果不指定依赖，空数组[]，读到的就是最开始的旧title，这是利用了闭包原理，不理解的话，有可能会写出bug
    // 这样写的话，不利于别人读代码，而且react也会警告，所以最好还是写上依赖，那么就要有useRef来解决
    // 简单来说，useRef就像一个储物箱，你可以随意存放任何东西，再次渲染时它会去储物箱找，createRef每次渲染都会返回一个新的引用，而useRef每次都会返回相同的引用。
    // 比如引用数据类型的对象，每次函数运行都是一个新对象，用来useRef就能每次都找到同一个对象
  }, [keepOnUnmount, oldTitle])
}

// 重置路由，这里的origin就是根路径，然后会刷新页面，比如在开发环境下就是到loaclhost:3000
// 这里一刷新就到了loaclhost:3000，然后会bootstrapUser，查询当前是否登录，进行渲染登录还是不登录的页面
// 然后加入已登录，就进去navigate，跳转到 '/projects'的路由下了
export const resetRoute = () => (window.location.href = window.location.origin)

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false)

  useEffect(() => {
    // 挂载上去的时候就为true
    mountedRef.current = true

    // 组件卸载时，把mountedRef设置为false
    return () => {
      mountedRef.current = false
    }
  })

  return mountedRef
}

/**
 * 传入一个对象，和（部分）键的集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  )

  // Object.fromEntries() 方法把键值对列表转换为一个对象。
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
  return Object.fromEntries(filteredEntries) as Pick<O, K>
}
