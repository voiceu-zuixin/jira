import { useEffect } from 'react'

export const Test = () => {
  useEffect(() => {
    console.log('useEffect')
  }, [])
  return <div>我是Test</div>
}
