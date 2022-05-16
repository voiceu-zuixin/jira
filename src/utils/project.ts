import { useMemo } from 'react'
import { useHttp } from './http'
import { Project } from 'screens/project-list/list'
import { useUrlQueryParam } from './url'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSearchParams } from 'react-router-dom'

export const useProjects = (param?: Partial<Project>) => {
  // 使用useHttp，得到一个函数，用于替换之前的fetch操作，还可以自动携带token
  const client = useHttp()

  // 用useQuery来代替useAsync

  // 第一个参数是数组的时候，当里面的依赖变化的时候，useQuery就会被触发
  return useQuery<Project[]>(['projects', param], () =>
    client('projects', { data: param })
  )
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

// Modal的全局状态管理器
export const useProjectsMoal = () => {
  // 判断现在是不是创建
  const [{ projectCreate }, setProjectModalOpen] = useUrlQueryParam([
    'projectCreate'
  ])

  // 根据当前url判断是不是应该编辑
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    'editingProjectId'
  ])

  // eslint-disable-next-line
  const [_, setUrlParams] = useSearchParams()

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  )

  const open = () => setProjectModalOpen({ projectCreate: true })

  // 为了让回退不带上 http://localhost:3000/projects?projectCreate=false 而是直接没有后缀
  // 用undefined 不用false，false会转换成字符串
  const close = () => {
    // setProjectModalOpen({ projectCreate: undefined })
    // setEditingProjectId({ editingProjectId: undefined })
    setUrlParams({ projectCreate: '', editingProjectId: '' })
  }

  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id })

  /* 
  返回tuple，元组（数组）的话，在后面调用的时候，比如const [x,xx,xxx] = useProjectsMoal()
  可以直接改名，但是是按照顺序来的，建议return的数据3个以内的用元组

  如果三个以上，建议返回对象，这样在调用的时候，const {projectCreate,open,close} = useProjectsMoal()
  就不能直接改名，但是顺序可以改变，因为读的是键名，可以通过冒号起别名，比如
  const {projectCreate : create ,open,close} = useProjectsMoal() 
  */
  return {
    // url上读取下来的都是字符串
    projectModalOpen: projectCreate === 'true' || Boolean(editingProject),
    open,
    close,
    startEdit,
    editingProject,
    isLoading
  }
}

// 这里不要在参数里写要传入，因为这个函数如果写了就是要被用到onCheckedChange内部，
// 而hook是不能被当做普通函数的回调函数的
// 所以需要的pin的参数，直接用异步请求获取，曲线救国
export const useEditProject = () => {
  const client = useHttp()
  const queryClient = useQueryClient()
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        data: params,
        method: 'PATCH'
      }),
    {
      // 用于即时刷新，相对于retry
      onSuccess: () => queryClient.invalidateQueries('projects')
    }
  )
}

// useAddProject
export const useAddProject = () => {
  const client = useHttp()
  const queryClient = useQueryClient()
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: 'POST'
      }),
    {
      // 用于即时刷新，相对于retry
      onSuccess: () => queryClient.invalidateQueries('projects')
    }
  )
}

// 获取具体的project详情
export const useProject = (id?: number) => {
  const client = useHttp()
  return useQuery<Project>(
    ['project', { id }],
    () => client(`projects/${id}`),
    {
      // 当id是undefined的时候，就不需要请求了
      enabled: Boolean(id)
    }
  )
}
