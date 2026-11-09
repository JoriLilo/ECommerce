import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getUser } from '../../utils/auth'
import type { Role } from '../../types/user'

// Describes the values and callbacks accepted by this component.
interface ProtectedRouteProps {
  allowedRoles?: Role[]
  children: ReactNode
}

// Redirects visitors without a saved user and checks any allowed roles.
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const user = getUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}