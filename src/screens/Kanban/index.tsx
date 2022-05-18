import { useDebounce, useDocumentTitle } from 'utils'
import {
  useKanbansInProject,
  useProjectInUrl,
  useTasksSearchParams
} from './util'
import { KanbanColumn } from './kanban-column'
import styled from '@emotion/styled'
import { SearchPanel } from './search-panel'
import { ScreenContainer } from 'components/lib'
import { useTasks } from 'utils/task'
import { Spin } from 'antd'
import { CreateKanban } from './create-kanban'
import { TaskModal } from './task-modal'

export default function KanbanScreen() {
  useDocumentTitle('看板列表')

  const { data: currentProject } = useProjectInUrl()

  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbansInProject()

  // 防抖，要在两处进行防抖，只要在外部用到了useTasks的，这里是一处，另一处是KanbanColumn
  const param = useTasksSearchParams()
  const debouncedallparam = useDebounce(param, 200)

  // useTasks内部的useQuery会等待debounce的异步完成后再去请求，useProjects同理
  const { isLoading: taskIsLoading } = useTasks(debouncedallparam)
  // const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams())

  const isLoading = taskIsLoading || kanbanIsLoading

  return (
    <ScreenContainer>
      <h1>{currentProject?.name}看板</h1>
      <SearchPanel />
      {isLoading ? (
        <Spin size={'large'} />
      ) : (
        <ColumnContainer>
          {kanbans?.map((kanban) => (
            <KanbanColumn kanban={kanban} key={kanban.id} />
          ))}
          <CreateKanban />
        </ColumnContainer>
      )}
      <TaskModal />
    </ScreenContainer>
  )
}

const ColumnContainer = styled.div`
  display: flex;
  /* 看板宽度不变，内容多了就开始滚动 */
  overflow-x: scroll;
  flex: 1;
  margin-right: 2rem;
`
