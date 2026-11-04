import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getUser } from '../../utils/auth'
import type { Role } from '../../types/user'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
  children: ReactNode
}

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