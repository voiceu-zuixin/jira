import './App.css'
import { useAuth } from 'context/auth-context'
import AuthenticatedAapp from 'authenticated-app'
import { UnauthenticatedApp } from 'unauthenticated-app'

function App() {
  const { user } = useAuth()
  return (
    <div className="App">
      user:{user?.name}
      {user?.token}
      {user ? <AuthenticatedAapp /> : <UnauthenticatedApp />}
      <code> '.env':{process.env.REACT_APP_API_URL}</code>
    </div>
  )
}

export default App
