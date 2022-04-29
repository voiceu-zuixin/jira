// import React from 'react'
import './App.css'
// import { ProjectListScreen } from 'test-screens/project-list'
import { ProjectListScreen } from 'screens/project-list'

function App() {
  console.log('app')
  return (
    <div className="App">
      <ProjectListScreen />
      <code> '.env':{process.env.REACT_APP_API_URL}</code>
    </div>
  )
}

export default App
