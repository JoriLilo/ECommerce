// Lists the account roles used by navigation and route checks.
export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

// Describes the account information saved with the login session.
export interface User {
  id: number
  fullName: string
  email: string
  role: Role
}

// Contains the credentials sent when signing in.
export interface LoginRequest {
  email: string
  password: string
}

// Contains the access token and user returned after a successful login.
export interface LoginResponse {
  accessToken: string
  user: User
  refreshToken: string
  tokenType: string
}

// Contains registration fields and the role selected in the form.
export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role: 'CUSTOMER' | 'SELLER'
}