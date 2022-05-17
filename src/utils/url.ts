import { useMemo, useState } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'
import { cleanObject, subset } from 'utils'

// 返回页面url中，指定参数的值
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  // useSearchParams是react-router-dom自带的，可以读取url的数据，但是要指定方法才能拿到内部数据
  // 比如searchParams.name 是不行的，可以通过searchParams.get('name')来获取，
  // 但是searchParams这个对象在有url数据的时候，是可见的，比如{personId: '1', name: '骑手'} ，只是直接searchParams.name取不到
  // 所以通过Object.fromEntries(searchParams)等一系列的方法，把值取出来，变成一个可用的对象，
  // 也可以用useMemo里面最开始的keys.reduce方法
  const [searchParams] = useSearchParams()

  const setSearchParams = useSetUrlSearchParam()

  const [stateKeys] = useState(keys)

  return [
    // 这里每次运行useUrlQueryParam，都会创建出一个新的值，所以需要用useMemo，会把第一个参数返回出去
    useMemo(
      () =>
        // 把传入的字符串数组类型的keys，转换成对象
        // keys.reduce((prev, key) => {
        //   // [key] 表示key是变量，而不是key字符串
        //   return { ...prev, [key]: searchParams.get(key) || '' }
        // }, {} as { [key in K]: string }), //[key in K] 就是[key : K]

        /* 
        改用这种方式写，比如要查询的是 stateKeys = ['name', 'personId']
        Object.fromEntries(searchParams)把searchParams变成一个对象
        subset把该对象过滤变成只含stateKeys中字符串键的对象
        */
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string
        },
      /* 
        基本类型可以放到依赖里，组件状态state可以放到依赖里
        非组件状态的对象，不可以放进去，会一直重复渲染，所以要用useMemo
        */
      [searchParams, stateKeys]
    ),

    // 后面有可能会传入数组，所以先用unknown类型
    // 这里用到了迭代器iterator，
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params)
    }
  ] as const //解决数组类型不一致的时候，ts推导类型会不易理解
}

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  return (params: { [key in string]: unknown }) => {
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
    // setSearchParams({name: '骑手', personId: '3'}) //可以把url变成http://localhost:3000/projects?name=骑手&personId=3
  }
}
