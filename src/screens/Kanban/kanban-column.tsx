import { Kanban } from 'types/kanban'
import { useTaskTypes } from 'utils/task-type'
import { useTasksInProject, useTasksModal, useTasksSearchParams } from './util'
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'
import styled from '@emotion/styled'
import { Card } from 'antd'
import { CreateTask } from './create-task'
import { useDebounce } from 'utils'
import { useTasks } from 'utils/task'

export function KanbanColumn({ kanban }: { kanban: Kanban }) {
  const param = useTasksSearchParams()
  // console.log(param)

  // 防抖
  const debouncedallparam = useDebounce(param, 200)
  // console.log(useDebounce(param, 2000))

  const { data: debouncedallTasks } = useTasks(debouncedallparam)

  // console.log(debouncedallTasks)

  const { data: allTasks } = useTasksInProject()
  // console.log(allTasks)

  // 挑出只有该column的tasks
  // const tasks = debouncedallTasks?.filter((task) => task.kanbanId === kanban.id)
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id)

  const { startEdit } = useTasksModal()

  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TasksContainer>
        {tasks?.map((task) => (
          <Card
            onClick={() => startEdit(task.id)}
            style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
            key={task.id}
          >
            <div>{task.name}</div>
            <TaskTypeIcon id={task.typeId} />
          </Card>
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  )
}

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes()
  const name = taskTypes?.find((taskTypes) => taskTypes.id === id)?.name
  if (!name) return null

  return <img src={name === 'task' ? taskIcon : bugIcon} alt="" />
}

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`
