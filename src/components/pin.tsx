import { Rate } from 'antd'

interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Pin = (props: PinProps) => {
  const { checked, onCheckedChange, ...restProps } = props
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      // onChange是antd自带定义好的，传进来的数据就是number
      onChange={(num) => onCheckedChange?.(!!num)}
      {...restProps}
    />
  )
}
