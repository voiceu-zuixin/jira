import { useEffect, useRef, useState } from 'react'
const apiUrl = process.env.REACT_APP_API_URL

let number_outside = 1
export const Test = () => {
  const [param, setParam] = useState({ name: '' })
  console.log('Test', number_outside)

  useEffect(() => {
    console.log('useEffect-同步')
    fetch(`${apiUrl}/projects?${param}`).then(async (response) => {
      if (response.ok) {
        let res = await response.json()
        console.log('res', res)
        // setParam(res)
      }
    })

    console.log('useEffect', number_outside)
  }, [])

  number_outside += 1
  console.log('number_outside',number_outside)

  return <div>我是Test</div>
}
