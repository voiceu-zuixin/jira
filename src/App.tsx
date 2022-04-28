import React from 'react'
import './App.css'
import { ProjectListScreen } from 'screens/project-list'

function App() {
  return (
    <div className="App">
      <ProjectListScreen />
      {/* <code> '.env':{process.env.REACT_APP_API_URL}</code> */}
    </div>
  )
}

export default App
