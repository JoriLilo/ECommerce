import { apiPost } from './api'
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/user'

export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', data)
}

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
