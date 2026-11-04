
import { apiPost } from './api.ts'
import type { LoginRequest, LoginResponse } from '../types/user.ts'
import type { RegisterRequest } from '../types/user.ts'


// ASSUMPTION: POST /auth/login takes { email, password } and returns { token, user }
export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', data)
}
// This also returns a user and a token that is why i made the return type login response
export function register(data: RegisterRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/register', data)
}


