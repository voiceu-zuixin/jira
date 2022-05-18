import React from 'react'
import { useTaskTypes } from 'utils/task-type'
import IdSelect from './id-select'

export function TaskTypeSelect(props: React.ComponentProps<typeof IdSelect>) {
  // 取出data，命名为users
  const { data: taskTypes } = useTaskTypes()
  // 把users当做options传入
  return <IdSelect options={taskTypes || []} {...props} />
}
