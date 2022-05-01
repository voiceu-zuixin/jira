import React from 'react'
// import ReactDOM from 'react-dom'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

// 就是这里，尼玛，这种脚手架直接创建的入口形式，会有两次渲染
import ReactDOM from 'react-dom/client'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // 不用这个严格模式吧，之前的代码都是直接包裹路由，也没用严格模式
  // react 17的时候严格模式不会render2遍，react 18会
  <App />
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
)

// 这样，用之前的形式才不会有两次渲染请求或者说hooks两次调用，但是这样会有警告
// Warning: ReactDOM.render is no longer supported in React 18.
// Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17.
// import ReactDOM from 'react-dom';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )

// console.log('ENV',process.env.REACT_APP_API_URL);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
