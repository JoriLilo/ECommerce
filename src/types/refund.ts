export type RefundStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED'

export interface Refund {
  id: number
  orderId: number
  sellerOrderId: number | null
  amount: number
  status: RefundStatus
  createdOn: string
}

export interface RefundPage {
  content: Refund[]
  totalPages: number
}
