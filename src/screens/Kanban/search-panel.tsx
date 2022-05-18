import { Button, Input } from 'antd'
import { Row } from 'components/lib'
import { TaskTypeSelect } from 'components/task-type-select'
import { UserSelect } from 'components/user-select'
import { useSetUrlSearchParam } from 'utils/url'
import { useTasksSearchParams } from './util'

export function SearchPanel() {
  // searchParams记录了TasksSearchParams参数
  const searchParams = useTasksSearchParams()

  // setSearchParams可以把参数更新到url中
  const setSearchParams = useSetUrlSearchParam()
  const reset = () => {
    setSearchParams({
      typeId: undefined,
      tagId: undefined,
      processorId: undefined,
      name: undefined
    })
  }

  return (
    <Row marginBottom={4} gap={true}>
      <Input
        style={{ width: '20rem' }}
        placeholder={'任务名'}
        value={searchParams.name}
        onChange={(evt) => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName={'经办人'}
        value={searchParams.processorId}
        onChange={(value) => setSearchParams({ processorId: value })}
      />
      <TaskTypeSelect
        defaultOptionName={'类型'}
        value={searchParams.typeId}
        onChange={(value) => setSearchParams({ typeId: value })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  )
}
