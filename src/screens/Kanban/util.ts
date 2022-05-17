// 本util文件只在kanban文件夹下用
import { useLocation } from 'react-router'
import { useKanbans } from 'utils/kanban'
import { useProject } from 'utils/project'
import { useTasks } from 'utils/task'

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation()

  // 用正则，取出url中的id，括号里的正则匹配到的，会成为返回值的第二个参数
  const id = pathname.match(/projects\/(\d+)/)?.[1]

  return Number(id)
}

export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useKanbansSearchParams = () => ({ prjectId: useProjectIdInUrl() })

export const useKanbansQueryKey = () => ['kanbans', useKanbansSearchParams()]

export const useTasksSearchParams = () => ({ prjectId: useProjectIdInUrl() })

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]

export const useKanbansInProject = () =>
  useKanbans({ projectId: useProjectIdInUrl() })

export const useTasksInProject = () =>
  useTasks({ projectId: useProjectIdInUrl() })
