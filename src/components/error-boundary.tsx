// 错误边界一定要用class组件来实现
import React, { Component } from 'react'

type FallbackRender = (props: { error: Error | null }) => React.ReactElement

// React.PropsWithChildren<R> ,把R和children结合在一起
export class ErrorBoundary extends Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  // 定义初始化state
  state = { error: null }

  // 当子组件抛出异常时，这里会接收到，并且调用，然后把state的error更新
  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    const { error } = this.state
    const { fallbackRender, children } = this.props

    // 如果有错误就返回fallbackRender
    if (error) return fallbackRender({ error })

    return children
  }
}
