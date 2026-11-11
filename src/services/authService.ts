import { apiPost } from './api'
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/user'
import { getRefreshToken } from '../utils/auth'

// Sends the login details and returns the user and token.
export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', data)
}

// Creates the account, then signs in to obtain its session.
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const registration = {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
  }

  await apiPost('/auth/register', registration)
  // Register creates the account; login gives us its user and token.
  const session = await login({
    email: registration.email,
    password: registration.password,
  })

  
  return session
}


export async function logoutBackend(): Promise<void> {
  try {
    const refreshToken = getRefreshToken()
    if(refreshToken) {

    await apiPost('/auth/logout', {refreshToken})

  }
  }finally {
    // Always clear the local session, even if the backend request fails.
    localStorage.removeItem('auth')
  }

}