import type { User } from './user'

// Lists the possible application and seller account statuses.
export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'

// Combines seller business details, account details, and approval status.
export interface SellerProfile {
  user: User
  id: number
  nipt: string
  businessPhone: string
  businessAddress: string
  status: SellerStatus
  rejectionReason?: string
}

// Describes a store's public id, name, and description.
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

// Contains business and store details collected during seller registration.
export interface SellerApplicationInput {
  nipt: string
  businessPhone: string
  businessAddress: string
  storeName: string
  storeDescription: string
}

// Contains a page of applications and its pagination information.
export interface SellerApplicationPage {
  content: SellerApplication[]
  totalPages: number
  totalElements: number
  number: number
}