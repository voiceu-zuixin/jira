// import React from 'react'
import './App.css'
// import { ProjectListScreen } from 'test-screens/project-list'
import { ProjectListScreen } from 'screens/project-list'
// import { Test } from 'test/test'
import { useEffect } from 'react'

function App() {
  // console.log('app')
  // useEffect(() => {
  //   console.log('useEffect-app')
  // }, [])
  return (
    <div className="App">
      <ProjectListScreen />
      {/* <Test /> */}
      <code> '.env':{process.env.REACT_APP_API_URL}</code>
    </div>
  )
}

export default App
