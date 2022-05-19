import { useDebounce, useDocumentTitle } from 'utils'
import {
  useKanbansInProject,
  useKanbansQueryKey,
  useKanbansSearchParams,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams
} from './util'
import { KanbanColumn } from './kanban-column'
import styled from '@emotion/styled'
import { SearchPanel } from './search-panel'
import { ScreenContainer } from 'components/lib'
import { useReorderTask, useTasks } from 'utils/task'
import { Spin } from 'antd'
import { CreateKanban } from './create-kanban'
import { TaskModal } from './task-modal'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Drag, Drop, DropChild } from 'components/drag-and-drop'
import { useKanbans, useReorderKanban } from 'utils/kanban'
import { useCallback } from 'react'

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

  const onDragEnd = useDragEnd()

  return (
    <DragDropContext
      onDragEnd={
        // 做持续化的工作
        onDragEnd
      }
    >
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size={'large'} />
        ) : (
          <ColumnContainer>
            {/*  放置 */}
            <Drop
              type={'COLUMN'}
              direction={'horizontal'}
              droppableId={'kanban'}
            >
              <DropChild style={{ display: 'flex' }}>
                {kanbans?.map((kanban, index) => (
                  // 拖拽
                  <Drag
                    key={kanban.id}
                    draggableId={'kanban' + kanban.id}
                    index={index}
                  >
                    <KanbanColumn kanban={kanban} key={kanban.id} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  )
}

// 处理拖拽持久化
export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbansSearchParams())

  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey())

  // 考虑一下是否需要防抖
  const { data: allTasks = [] } = useTasks(useTasksSearchParams())

  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey())

  // hook里返回的函数都要在useCallback里包裹起来
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return

      // kanban看板排序
      if (type === 'COLUMN') {
        const fromId = kanbans?.[source.index].id
        const toId = kanbans?.[destination.index].id
        if (!fromId || !toId || fromId === toId) return

        const type = destination.index > source.index ? 'after' : 'before'

        reorderKanban({ fromId, referenceId: toId, type })
      }

      // task任务排序
      if (type === 'ROW') {
        // string 变成 number
        const fromKanbanId = +source.droppableId
        const toKanbanId = +destination.droppableId

        // 跨看板排序，如果fromKanbanId === toKanbanId不做操作
        if (fromKanbanId === toKanbanId) {
          return
        }

        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index]

        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ]

        if (fromTask?.id === toTask?.id) {
          // 什么都不做
          return
        }

        const type =
          fromKanbanId === toKanbanId && destination.index > source.index
            ? 'after'
            : 'before'

        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          type,
          fromKanbanId,
          toKanbanId
        })
      }
    },
    [kanbans, reorderKanban, allTasks, reorderTask]
  )
}

const ColumnContainer = styled('div')`
  display: flex;
  /* 看板宽度不变，内容多了就开始滚动 */
  overflow-x: scroll;
  flex: 1;
  margin-right: 2rem;
`
