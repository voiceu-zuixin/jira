import { useMemo } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'
import { cleanObject } from 'utils'

// 返回页面url中，指定参数的值
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // useSearchParams是react-router-dom自带的，可以读取url的数据，但是要指定方法才能拿到内部数据
  const [searchParams, setSearchParams] = useSearchParams()

  // 测试Object.fromEntries(searchParams)是什么
  // console.log(Object.fromEntries(searchParams))

  return [
    // 这里每次运行useUrlQueryParam，都会创建出一个新的值，所以需要用useMemo，会把第一个参数返回出去
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          // [key] 表示key是变量，而不是key字符串
          return { ...prev, [key]: searchParams.get(key) || '' }
        }, {} as { [key in K]: string }), //[key in K] 就是[key : K]

      /* 
        基本类型可以放到依赖里，组件状态state可以放到依赖里
        非组件状态的对象，不可以放进去，会一直重复渲染
      */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [searchParams]
    ),
    // 后面有可能会传入数组，所以先用unknown类型
    // 这里用到了迭代器iterator，
    (params: Partial<{ [key in K]: unknown }>) => {
      // 因为searchParams要拿到{name: '骑手', personId: '2'}的name，personId等属性，必须要通过get方法
      // 本身的话是一个包含了其他方法的对象，通过Object.fromEntries(searchParams)就能得到{name: '骑手', personId: '2'}的形式的对象
      // 处理传入的searchParams，Object.fromEntries方法把键值对列表转换为一个对象
      // 然后用params替换该对象，再cleanObject
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params
      }) as URLSearchParamsInit

      // 然后把处理之后的对象进行更新，setSearchParams方法可以把参数更新到url中
      // return setSearchParams(o)
      setSearchParams(o) //感觉这里不用return也行
      // setSearchParams({name: '骑手', personId: '3'}) //感觉这里不用return也行
    }
  ] as const //解决数组类型不一致的时候，ts推导类型会不易理解
}
