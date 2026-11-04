
import { apiPost } from './api.ts'
import type { LoginRequest, LoginResponse } from '../types/user.ts'
import type { RegisterRequest } from '../types/user.ts'


// ASSUMPTION: POST /auth/login takes { email, password } and returns { token, user }
export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', data)
}
// This also returns a user and a token that is why i made the return type login response
const USE_MOCK = true   // TODO: set to false when the backend is ready

export function register(data: RegisterRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    return Promise.resolve({
      token: 'fake-token',
      user: { id: 1, name: data.name, email: data.email, role: data.role },
    })
  }
  return apiPost<LoginResponse>('/auth/register', data)
}


