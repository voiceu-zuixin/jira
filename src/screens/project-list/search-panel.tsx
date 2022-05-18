import { Form, Input } from 'antd'
import { UserSelect } from 'components/user-select'
import { Project } from '../../types/project'
import { User } from '../../types/user'

interface SearchPanelProps {
  users: User[]

  //在Project选取'name' | 'personId'的类型，然后再Partial之后，这个'name' | 'personId'可以是原类型，也可以是undefined
  param: Partial<Pick<Project, 'name' | 'personId'>>

  setParam: (param: SearchPanelProps['param']) => void
}

// 解构拿到state
export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: '2rem' }} layout={'inline'}>
      <Form.Item>
        <Input
          type="text"
          value={param.name}
          placeholder={'项目名'}
          //解构param,触发就更新param
          onChange={(evt) => setParam({ ...param, name: evt.target.value })}
        />
      </Form.Item>
      <Form.Item>
        {/*  UserSelect 内部会实现用useUser获取users等数据，然后渲染搜索框的下拉列表数据，
            只需要把value这些，手动选择的数据传入即可  */}
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
        ></UserSelect>
      </Form.Item>
    </Form>
  )
}
