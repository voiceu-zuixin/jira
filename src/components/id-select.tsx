import { Select } from 'antd'
import { Raw } from 'types'

// 想让antd的Select组件内部的所有属性类型，也给到IdSelectProps，可以用这种方式获得
type SelectProps = React.ComponentProps<typeof Select>

// interface IdSelectProps extends SelectProps这样会让IdSelectProps内部定义的比如options与SelectProps
// 内部的options相冲突，所以用Omit进行删除相同键名的类型
interface IdSelectProps
  extends Omit<SelectProps, 'options' | 'value' | 'onChange'> {
  value?: Raw | null | undefined
  onChange?: (value?: number) => void
  defaultOptionName?: string
  // 是一个{ name: string; id: number }对象类型的数组
  options?: { name: string; id: number }[]
}

/* 
value可以传入多种类型的值
onChange只会回调 number|undefined 类型，当传入的不是0 的时候，就正常逻辑，传入是0的时候就传入undefined
当 isNaN(Number(value)) === true 的时候，代表选择默认类型
当选择默认类型的时候，onChange会回调undefined
*/
export default function IdSelect(props: IdSelectProps) {
  // 这里传入的options就是异步请求获取到的骑手等数据，value是为在前端手动选择的请求数据
  const { value, onChange, defaultOptionName, options, ...restProps } = props

  return (
    <Select
      //当网络慢的时候，url是有选择的，但是数据还没回来，这个时候应该显示默认的数据，而不是url的表单数字
      // 所以给一个0，就会显示defaultOptionName
      value={options?.length ? toNumber(value) : 0}
      // onChange(toNumber(value) || undefined) ，当toNumber(value)为0 的时候就看后一个参数了，所以其结果就是undefined
      // 即是onChange(undefined)
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      // 其余的Select自带的属性，或者使用者在父级组件透传下来的属性
      {...restProps}
    >
      {
        // 默认选项就是value为 0 的时候，在search-panel里面就是 负责人 的选项
        defaultOptionName ? (
          <Select.Option value={0}>{defaultOptionName}</Select.Option>
        ) : null
      }
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  )
}

// 把所有没有数字意义的都转化成0，比如 '213a'
const toNumber = (value: unknown) => {
  return isNaN(Number(value)) ? 0 : Number(value)
}
