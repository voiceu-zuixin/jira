import { Input, Select } from 'antd'

// list组件也要用，所以还需要导出User
export interface User {
  id: string
  name: string
  email: string
  title: string
  organization: string
  token: string
}

interface SearchPanelProps {
  users: User[]
  param: {
    name: string
    personId: string
  }

  setParam: (param: SearchPanelProps['param']) => void
}

// 解构拿到state
export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <form>
      <div>
        <Input
          type="text"
          value={param.name}
          //解构param,触发就更新param
          onChange={(evt) => setParam({ ...param, name: evt.target.value })}
        />

        <Select
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
        >
          <Select.Option value={''}>负责人</Select.Option>
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </form>
  )
}
