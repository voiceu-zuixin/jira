import './App.css'
import { ProjectListScreen } from 'screens/project-list'
import LoginScreen from 'screens/login'

function App() {
  return (
    <div className="App">
      <ProjectListScreen />
      <LoginScreen />
      <code> '.env':{process.env.REACT_APP_API_URL}</code>
    </div>
  )
}

export default App
