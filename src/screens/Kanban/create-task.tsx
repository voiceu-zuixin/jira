import { Card, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useAddTask } from 'utils/task'
import { useProjectIdInUrl, useTasksQueryKey } from './util'

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState('')
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey())
  const projectId = useProjectIdInUrl()

  // 输入状态或者非输入状态
  const [inputMode, setInputMode] = useState(false)
  const submit = async () => {
    await addTask({ projectId, name, kanbanId })
    setInputMode(false)
    setName('')
  }

  const toggle = () => setInputMode((mode) => !mode)

  useEffect(() => {
    // 变到了非输入状态的话，就要重置name
    if (!inputMode) {
      setName('')
    }
  }, [inputMode])

  if (!inputMode) {
    return <div onClick={toggle}> + 创建事务</div>
  }

  return (
    <Card>
      <Input
        onBlur={toggle}
        placeholder={'需要做些什么'}
        autoFocus={true}
        onPressEnter={submit}
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
    </Card>
  )
}
