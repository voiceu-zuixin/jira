import { Kanban } from 'types/kanban'
import { useTaskTypes } from 'utils/task-type'
import { useTasksInProject } from './util'
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'
import styled from '@emotion/styled'
import { Card } from 'antd'

export function KanbanColumn({ kanban }: { kanban: Kanban }) {
  const { data: allTasks } = useTasksInProject()

  // 挑出只有该column的tasks
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id)

  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TasksContainer>
        {tasks?.map((task) => (
          <Card style={{ marginBottom: '0.5rem' }} key={task.id}>
            <div>{task.name}</div>
            <TaskTypeIcon id={task.typeId} />
          </Card>
        ))}
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

const Container = styled.div`
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