import React from 'react'
import { Kanban } from 'types/kanban'
import { useTaskTypes } from 'utils/task-type'
import { useKanbansQueryKey, useTasksModal, useTasksSearchParams } from './util'
import taskIcon from 'assets/task.svg'
import bugIcon from 'assets/bug.svg'
import styled from '@emotion/styled'
import { Button, Card, Dropdown, Menu, MenuProps, Modal } from 'antd'
import { CreateTask } from './create-task'
import { useDebounce } from 'utils'
import { useTasks } from 'utils/task'
import { Task } from 'types/task'
import { Mark } from 'components/mark'
import { useDeleteKanban } from 'utils/kanban'
import { Row } from 'components/lib'

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  // 防抖，要在两处进行防抖，只要在外部用到了useTasks的，这里是一处，另一处是kanban/index
  const param = useTasksSearchParams()
  const debouncedallparam = useDebounce(param, 200)
  const { data: debouncedallTasks } = useTasks(debouncedallparam)

  // 挑出只有该column的tasks
  const tasks = debouncedallTasks?.filter((task) => task.kanbanId === kanban.id)

  return (
    <Container {...props} ref={ref}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>
      <TasksContainer>
        {tasks?.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  )
})

// 抽离TaskCard
export const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal()

  // 取出name当做keyword
  const { name: keyword } = useTasksSearchParams()

  return (
    <Card
      onClick={() => startEdit(task.id)}
      style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
      key={task.id}
    >
      <p>
        <Mark keyword={keyword} name={task.name} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  )
}

// 删除看板等功能
const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey())

  const startDelete = () => {
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: '确定删除看板吗',
      onOk() {
        return mutateAsync({ id: kanban.id })
      }
    })
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <Button onClick={startDelete} type={'link'}>
          删除
        </Button>
      ),
      key: 'add'
    }
  ]

  const overlay = <Menu items={items} />

  return (
    <Dropdown overlay={overlay}>
      <Button type={'link'}>...</Button>
    </Dropdown>
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
