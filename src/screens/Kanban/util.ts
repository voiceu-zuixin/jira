// 本util文件只在kanban文件夹下用
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { useKanbans } from 'utils/kanban'
import { useProject } from 'utils/project'
import { useTasks } from 'utils/task'
import { useUrlQueryParam } from 'utils/url'

// 通过正则取到url中的projectId
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation()

  // 用正则，取出url中的id，括号里的正则匹配到的，会成为返回值的第二个参数
  const id = pathname.match(/projects\/(\d+)/)?.[1]

  return Number(id)
}

export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useKanbansSearchParams = () => ({ prjectId: useProjectIdInUrl() })

export const useKanbansQueryKey = () => ['kanbans', useKanbansSearchParams()]

// TasksSearchParams返回一个useMemo保存的对象，记录了TasksSearchParams参数
export const useTasksSearchParams = () => {
  // useUrlQueryParam返回页面url中，指定参数的值，组合成一个对象
  const [param, setParam] = useUrlQueryParam([
    'name',
    'typeId',
    'processorId',
    'tagId'
  ])

  // 通过正则取到url中的projectId
  const projectId = useProjectIdInUrl()

  // 返回TasksSearchParams参数对象
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      tagId: Number(param.tagId) || undefined,
      processorId: Number(param.processorId) || undefined,
      name: param.name || undefined
    }),
    [projectId, param]
  )
}

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]

export const useKanbansInProject = () =>
  useKanbans({ projectId: useProjectIdInUrl() })

// 函数，调用该函数可以得到useQuery()后的结果对象，具有data，refetch等属性
export const useTasksInProject = () => useTasks(useTasksSearchParams()) //返回一个useQuery()后的结果对象，具有data，refetch等属性
