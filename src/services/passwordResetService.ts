import { apiPost } from './api'

// Requests a reset email. The API helper adds the /api prefix.
export function requestPasswordReset(email: string): Promise<void> {
  return apiPost<void>('/auth/forgot-password', { email: email.trim() })
}

// Submits the reset token from the email link and the new password.
export function resetPassword(token: string, newPassword: string): Promise<void> {
  return apiPost<void>('/auth/reset-password', { token, newPassword })
}
