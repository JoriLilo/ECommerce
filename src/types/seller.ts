import type { User } from './user'

export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'

export interface SellerProfile {
  user: User
  id: number
  nipt: string
  businessPhone: string
  businessAddress: string
  status: SellerStatus
  rejectionReason?: string
}

export interface Store {
  id: number
  name: string
  description: string
}
// The backend includes account details inside user.
export interface SellerApplication extends SellerProfile {
  user: User
  createdOn: string
}

export interface SellerApplicationInput {
  nipt: string
  businessPhone: string
  businessAddress: string
  storeName: string
  storeDescription: string
}

export interface SellerApplicationPage {
  content: SellerApplication[]
  totalPages: number
  totalElements: number
  number: number
}