import './App.css'
import { useAuth } from 'context/auth-context'
import AuthenticatedAapp from 'authenticated-app/authenticated-app'
import { UnauthenticatedApp } from 'unauthenticated-app'
import { ErrorBoundary } from 'components/error-boundary'
import { FullPageErrorFallback } from 'components/lib'

function App() {
  const { user } = useAuth()
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        {user ? <AuthenticatedAapp /> : <UnauthenticatedApp />}
        <code> '.env':{process.env.REACT_APP_API_URL}</code>
      </ErrorBoundary>
    </div>
  )
}

export default App
