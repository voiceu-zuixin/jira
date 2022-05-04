import { useAuth } from 'context/auth-context'
import { ProjectListScreen } from 'screens/project-list'

export default function AuthenticatedAapp() {
  const { logout } = useAuth()
  return (
    <div>
      <button onClick={logout}>登出</button>
      <ProjectListScreen />
    </div>
  )
}
