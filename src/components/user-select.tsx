import React from 'react'
import { useUser } from 'utils/user'
import IdSelect from './id-select'

export default function UserSelect(
  props: React.ComponentProps<typeof IdSelect>
) {
  // 取出data，命名为users
  const { data: users } = useUser()
  // 把users当做options传入
  return <IdSelect options={users || []} {...props} />
}
