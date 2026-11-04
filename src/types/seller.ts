export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' // TODO: check the SellerStatus enum

export interface SellerProfile {
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