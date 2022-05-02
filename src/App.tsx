import './App.css'
// import { ProjectListScreen } from 'screens/project-list'
// import { Test } from 'test/test'
// import TestClass from 'test/test-class'
import LoginScreen from 'screens/login'

function App() {
  return (
    <div className="App">
      {/* <ProjectListScreen /> */}
      {/* <Test /> */}
      {/* <TestClass /> */}
      <LoginScreen />
      <code> '.env':{process.env.REACT_APP_API_URL}</code>
    </div>
  )
}

export default App
