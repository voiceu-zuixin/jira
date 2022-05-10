import { useEffect, useMemo } from 'react'
import { cleanObject } from 'utils'
import { useHttp } from './http'
import { useAsync } from './use-async'
import { Project } from 'screens/project-list/list'
import { useUrlQueryParam } from './url'

export const useProjects = (param?: Partial<Project>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 导入useAsync，   isLoading本来就有
  const { run, ...result } = useAsync<Project[]>()

  const fetchProjects = () => client('projects', { data: cleanObject(param || {}) })

  // param改变就会触发的useEffect
  useEffect(() => {
    // 为了让异步请求尚未返回的时候有loading效果
    run(fetchProjects(), {
      retry: fetchProjects
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])

  return result
}

// 用于search-panel等地方，获取url的表单数据或者表单数据同步到url
// 项目列表搜索的参数
export const useProjectSearchParams = () => {
  // 初始化param，用于一开始的输入框为空白,在子组件里输入后,onChange会触发setParam,
  // 并进行更新param,然后再次传给子组件,进行渲染,保留在输入框

  // 从url中获取param，这种解构是按顺序来的，经过解构出来的param是通过url查询后形成的对象
  // 比如{name: '骑手', personId: '2'}
  // 当SearchPanel的value改变的时候发生onChange，调用setParam，
  // setParam内部会把param再同步的更新到url上，
  const [param, setParam] = useUrlQueryParam(['name', 'personId'])

  // 但是useUrlQueryParam从url上读取下来的param是string类型，希望是得到number类型
  return [
    // 同样需要useMemo来解决，每次都会解构然后变成新对象
    useMemo(
      () => ({
        // 解构param，把string类型的personId改成number或者是undefined，覆盖string类型的原数据
        ...param,
        // 覆盖，不想要一个为0的id，就给一个undefined
        personId: Number(param.personId) || undefined
      }),
      [param]
    ),
    setParam
  ] as const
}

// 这里不要在参数里写要传入，因为这个函数如果写了就是要被用到onCheckedChange内部，
// 而hook是不能被当做普通函数的回调函数的
// 所以需要的pin的参数，直接用异步请求获取，曲线救国
export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH'
      })
    )
  }

  return { mutate, ...asyncResult }
}

// useAddProject
export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync()
  const client = useHttp()
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: 'POST'
      })
    )
  }

  return { mutate, ...asyncResult }
}
