
import { apiPost } from './api.ts'
import type { LoginRequest, LoginResponse } from '../types/user.ts'
import type { RegisterRequest } from '../types/user.ts'


// ASSUMPTION: POST /auth/login takes { email, password } and returns { token, user }
export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', data)
}
// This also returns a user and a token that is why i made the return type login response
 // TODO: set to false when the backend is ready


export async function register(data: RegisterRequest): Promise<LoginResponse> {
  console.log('register data received:', data)
  const payload = {
    fullName: data.fullName?.trim(),
    email: data.email.trim(),
    password: data.password,
    role: data.role,
  }
  console.log('register payload:', payload)
  await apiPost('/auth/register', payload)
  return login({ email: payload.email, password: payload.password })
}

