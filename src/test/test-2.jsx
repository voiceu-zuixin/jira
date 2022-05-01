import { useEffect, useRef, useState } from 'react'
const apiUrl = process.env.REACT_APP_API_URL

export const Test = () => {
  const didLogRef = useRef(false)
  console.log('test')

  const [param, setParam] = useState({
    name: ''
  })
  console.log(param)

  useEffect(() => {
    // 通过ref只执行一次
    if (didLogRef.current === false) {
      didLogRef.current = true
      console.log('useEffect-1')
    }
    fetch(`${apiUrl}/projects?${param}`).then(async (response) => {
      if (response.ok) {
        // 异步函数，会等待await后方的函数执行完毕后，再继续往下执行
        // 此处就是等待，但是我认为这里不写await也行，因为进入then的时候response应该已经确定了
        // pending的话进不去后面的，事实证明不是这样的，
        // 跟普通promise不同，response对象是一个Response 对象，其中Response.json()方法会返回一个Promise对象
        //等待response.json()，该函数返回的是一个Promise对象，随后更新list
        // console.log(response.json())
        let res = await response.json()
        console.log('res', res)
        setParam(res)
      }
    })
    console.log('useEffect-2')
  }, [])
  return <div>我是Test</div>
}
