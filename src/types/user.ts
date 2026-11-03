export type Role = 'SELLER' | 'CUSTOMER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: Role
}