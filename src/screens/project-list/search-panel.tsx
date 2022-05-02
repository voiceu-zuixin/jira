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
        <input
          type="text"
          value={param.name}
          //解构param,触发就更新param
          onChange={(evt) => setParam({ ...param, name: evt.target.value })}
        />

        <select
          value={param.personId}
          onChange={(evt) => setParam({ ...param, personId: evt.target.value })}
        >
          <option value={''}>负责人</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
