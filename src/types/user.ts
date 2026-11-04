export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: Role          //Exclude<Role, 'ADMIN'>   // 'CUSTOMER' | 'SELLER'
}