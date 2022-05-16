import styled from '@emotion/styled'
import { Button, Spin, Typography } from 'antd'
import { DevTools } from 'jira-dev-tool'

export const Row = styled.div<{
  gap?: number | boolean
  between?: boolean
  marginBottom?: number
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? 'space-between' : undefined)};
  margin-bottom: ${(props) => props.marginBottom + 'rem'};

  /* 下面的直接子元素的margin要重写，不然会影响 */
  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      //注意，这里加了一个gap属性，就需要在前面给Row的类型上加上去
      typeof props.gap === 'number'
        ? props.gap + 'rem'
        : props.gap
        ? '2rem'
        : undefined};
  }
`

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const FullPageLoading = () => (
  <FullPage>
    <Spin size="large" />
  </FullPage>
)

export const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <FullPage>
    <DevTools />
    <ErrorBox error={error} />
  </FullPage>
)

// 类型守卫 当value?.message条件为真的时候 value is Error，注意字符串的0也是true，而0和undefined则是false
const isError = (value: any): value is Error => value?.message

// 当整的是Error类型的时候，出现的组件
export const ErrorBox = ({ error }: { error: unknown }) => {
  // 当error为unknown的时候，不能在error上读取任何属性，加问号error?.message也不行，所以需要用到类型守卫
  if (isError(error)) {
    return <Typography.Text type={'danger'}>{error?.message}</Typography.Text>
  }
  return null
}

// ButtonNoPadding就是改了样式的antd的Button
export const ButtonNoPadding = styled(Button)`
  padding: 0;
`
