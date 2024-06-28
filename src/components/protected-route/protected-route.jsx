import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children, condition }) {
  if (!condition) return <Navigate to='/login' replace />

  return children
}
